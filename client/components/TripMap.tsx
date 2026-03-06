import { useEffect, useRef, memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Navigation, Maximize2 } from "lucide-react";

interface Place {
  name: string;
  description?: string;
  lat?: number;
  lon?: number;
  dist?: number;
}

interface TripMapProps {
  origin: string;
  destination: string;
  originCoords?: { lat: number; lon: number };
  destCoords?: { lat: number; lon: number };
  places?: Place[];
  weather?: { temp?: number; description?: string } | null;
}

// Lazy-load Leaflet only on client, avoids SSR issues
let L: typeof import("leaflet") | null = null;

function getLeaflet() {
  if (L) return Promise.resolve(L);
  return import("leaflet").then((mod) => {
    L = mod.default ?? mod;
    // Fix default icon paths broken by bundlers
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
    return L;
  });
}

// Geocode a city name → lat/lon using Nominatim (free, no key)
async function geocodeCity(
  city: string,
): Promise<{ lat: number; lon: number } | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`,
      { headers: { "Accept-Language": "en" } },
    );
    const data = await res.json();
    if (!data || !data[0]) return null;
    return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
  } catch {
    return null;
  }
}

function TripMap({
  origin,
  destination,
  originCoords,
  destCoords,
  places = [],
  weather,
}: TripMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    let mounted = true;

    async function initMap() {
      const leaflet = await getLeaflet();
      if (!mounted || !mapRef.current) return;

      // If map already exists, remove it
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Geocode if coords not provided
      let oCoords = originCoords;
      let dCoords = destCoords;

      if (!oCoords && origin)
        oCoords = (await geocodeCity(origin)) ?? undefined;
      if (!dCoords && destination)
        dCoords = (await geocodeCity(destination)) ?? undefined;

      if (!mounted || !mapRef.current) return;

      // Default to world view if no coords
      const center: [number, number] = dCoords
        ? [dCoords.lat, dCoords.lon]
        : oCoords
          ? [oCoords.lat, oCoords.lon]
          : [20, 78]; // India default

      const zoom = dCoords || oCoords ? 6 : 4;

      // Create map
      const map = leaflet.map(mapRef.current, {
        center,
        zoom,
        zoomControl: true,
        scrollWheelZoom: false,
      });
      mapInstanceRef.current = map;

      // OpenStreetMap tiles (completely free)
      leaflet
        .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 19,
        })
        .addTo(map);

      const bounds: [number, number][] = [];

      // Origin marker (green)
      if (oCoords) {
        const originIcon = leaflet.divIcon({
          html: `<div style="background:linear-gradient(135deg,#22c55e,#16a34a);width:32px;height:32px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid white;box-shadow:0 4px 12px rgba(34,197,94,0.5)"></div>`,
          className: "",
          iconSize: [32, 32],
          iconAnchor: [16, 32],
        });
        leaflet
          .marker([oCoords.lat, oCoords.lon], { icon: originIcon })
          .addTo(map)
          .bindPopup(
            `<div style="font-family:Inter,sans-serif;min-width:140px"><b>🚀 Origin</b><br><span style="color:#6b7280">${origin}</span></div>`,
          );
        bounds.push([oCoords.lat, oCoords.lon]);
      }

      // Destination marker (primary/cyan)
      if (dCoords) {
        const destIcon = leaflet.divIcon({
          html: `<div style="background:linear-gradient(135deg,#06b6d4,#0891b2);width:38px;height:38px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid white;box-shadow:0 6px 18px rgba(6,182,212,0.6)"></div>`,
          className: "",
          iconSize: [38, 38],
          iconAnchor: [19, 38],
        });

        const weatherHtml = weather
          ? `<br><span style="color:#9ca3af">🌡️ ${weather.temp ?? "?"}°C — ${weather.description ?? ""}</span>`
          : "";

        leaflet
          .marker([dCoords.lat, dCoords.lon], { icon: destIcon })
          .addTo(map)
          .bindPopup(
            `<div style="font-family:Inter,sans-serif;min-width:160px"><b>🎯 Destination</b><br><span style="color:#6b7280">${destination}</span>${weatherHtml}</div>`,
          )
          .openPopup();
        bounds.push([dCoords.lat, dCoords.lon]);
      }

      // Route polyline (dashed, glowing)
      if (oCoords && dCoords) {
        // Draw arc by inserting midpoints
        const latMid = (oCoords.lat + dCoords.lat) / 2 + 4;
        const lonMid = (oCoords.lon + dCoords.lon) / 2;
        leaflet
          .polyline(
            [
              [oCoords.lat, oCoords.lon],
              [latMid, lonMid],
              [dCoords.lat, dCoords.lon],
            ],
            {
              color: "#06b6d4",
              weight: 3,
              opacity: 0.8,
              dashArray: "10, 8",
              lineJoin: "round",
            },
          )
          .addTo(map);
      }

      // Nearby places as small markers
      places.slice(0, 12).forEach((place) => {
        if (!place.lat || !place.lon) return;
        const placeIcon = leaflet.divIcon({
          html: `<div style="background:rgba(139,92,246,0.85);width:10px;height:10px;border-radius:50%;border:2px solid white;box-shadow:0 2px 6px rgba(139,92,246,0.5)"></div>`,
          className: "",
          iconSize: [10, 10],
          iconAnchor: [5, 5],
        });
        leaflet
          .marker([place.lat, place.lon], { icon: placeIcon })
          .addTo(map)
          .bindPopup(
            `<div style="font-family:Inter,sans-serif;max-width:160px"><b>📍 ${place.name}</b><br><span style="color:#6b7280;font-size:11px">${place.description ?? ""}</span></div>`,
          );
        bounds.push([place.lat, place.lon]);
      });

      // Fit map to all markers
      if (bounds.length >= 2) {
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 9 });
      }
    }

    initMap();

    return () => {
      mounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [origin, destination, originCoords, destCoords, places, weather]);

  return (
    <Card className="glass-card border-primary/20 overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Navigation className="h-4 w-4 text-primary" />
          Route Map
          <span className="ml-auto flex items-center gap-1.5 text-xs font-normal text-muted-foreground">
            <MapPin className="h-3 w-3 text-green-400" />
            {origin}
            <span className="text-primary/50">→</span>
            <MapPin className="h-3 w-3 text-cyan-400" />
            {destination}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {/* Leaflet CSS */}
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        />
        <div
          ref={mapRef}
          style={{
            height: "420px",
            width: "100%",
            borderRadius: "0 0 16px 16px",
          }}
          className="z-0"
        />
        <div className="px-4 py-2 flex items-center justify-between text-[11px] text-muted-foreground border-t border-primary/10">
          <span>
            🟢 Origin &nbsp;&nbsp; 🔵 Destination &nbsp;&nbsp; 🟣 Nearby Places
          </span>
          <span className="flex items-center gap-1">
            <Maximize2 className="h-3 w-3" />
            Scroll to zoom disabled — use +/− buttons
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export default memo(TripMap);
