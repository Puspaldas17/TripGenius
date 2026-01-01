import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Backpack, Download, Plus } from "lucide-react";
import { useState, useMemo } from "react";
import type { WeatherResponse } from "@shared/api";

interface PackingItem {
  category: string;
  items: string[];
}

const PACKING_DATABASE = {
  essentials: {
    category: "Essentials",
    items: [
      "Passport & visa",
      "Travel insurance documents",
      "Flight/train tickets",
      "Hotel confirmations",
      "Credit cards & cash",
      "Phone & charger",
    ],
  },
  clothing: {
    category: "Clothing",
    items: [
      "Underwear & socks (7-10 pairs)",
      "T-shirts & tops",
      "Shorts & pants",
      "Jacket or sweater",
      "Sleepwear",
      "Comfortable walking shoes",
      "Formal shoes",
      "Accessories (belt, scarves)",
    ],
  },
  warm: {
    category: "Cold Weather",
    items: [
      "Heavy winter coat",
      "Thermal underwear",
      "Warm hat & gloves",
      "Scarves & neck warmers",
      "Heavy socks",
      "Snow boots",
    ],
  },
  tropical: {
    category: "Tropical/Hot Weather",
    items: [
      "Light, breathable clothing",
      "Shorts & skirts",
      "Sandals & flip-flops",
      "Wide-brimmed hat",
      "Sunglasses",
      "Lightweight rain jacket",
    ],
  },
  toiletries: {
    category: "Toiletries",
    items: [
      "Toothbrush & toothpaste",
      "Deodorant",
      "Shampoo & conditioner",
      "Soap or body wash",
      "Razor & shaving cream",
      "Sunscreen",
      "Moisturizer",
      "First aid kit",
      "Medications",
      "Feminine products (if needed)",
    ],
  },
  documents: {
    category: "Important Documents",
    items: [
      "Copies of passport/ID",
      "Travel insurance card",
      "Contact information of embassy",
      "Emergency contacts",
      "Vaccine certificates",
    ],
  },
  electronics: {
    category: "Electronics",
    items: [
      "Laptop/tablet",
      "Phone & chargers",
      "Power adapter/converter",
      "Headphones",
      "Portable charger",
      "Camera",
    ],
  },
};

interface PackingListProps {
  weather: WeatherResponse | null;
  destination: string;
  days: number;
}

export default function PackingList({
  weather,
  destination,
  days,
}: PackingListProps) {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const getRecommendedItems = useMemo(() => {
    const items: PackingItem[] = [
      PACKING_DATABASE.essentials,
      PACKING_DATABASE.toiletries,
      PACKING_DATABASE.documents,
      PACKING_DATABASE.electronics,
    ];

    // Add weather-specific items
    if (weather) {
      const avgTemp =
        (weather.daily[0]?.tempMax || 20) + (weather.daily[0]?.tempMin || 15);
      const temp = avgTemp / 2;

      if (temp < 10) {
        items.push(PACKING_DATABASE.warm as any);
      } else if (temp > 28) {
        items.push(PACKING_DATABASE.tropical as any);
      }
    }

    return items;
  }, [weather]);

  const toggleItem = (itemId: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(itemId)) {
      newChecked.delete(itemId);
    } else {
      newChecked.add(itemId);
    }
    setCheckedItems(newChecked);
  };

  const downloadChecklist = () => {
    const content = getRecommendedItems
      .map(
        (cat) =>
          `${cat.category}\n${cat.items.map((i) => `- ${i}`).join("\n")}`,
      )
      .join("\n\n");

    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(content),
    );
    element.setAttribute("download", `packing-list-${destination}.txt`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const completionPercentage =
    getRecommendedItems.length > 0
      ? Math.round(
          (checkedItems.size /
            getRecommendedItems.reduce(
              (sum, cat) => sum + cat.items.length,
              0,
            )) *
            100,
        )
      : 0;

  return (
    <Card className="hover:shadow-lg transition">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Backpack className="h-5 w-5 text-primary" />
            Smart Packing List
          </CardTitle>
          <div className="text-right">
            <p className="text-xl font-bold">{completionPercentage}%</p>
            <p className="text-[9px] text-muted-foreground">packed</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {days}d trip to {destination}
        </p>
      </CardHeader>
      <CardContent className="space-y-2">
        {/* Progress bar */}
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>

        {/* Packing categories */}
        <div className="space-y-2">
          {getRecommendedItems.map((category) => (
            <div key={category.category} className="space-y-1">
              <h4 className="font-semibold text-xs flex items-center gap-1.5">
                {category.category}
                <Badge variant="secondary" className="text-[8px] py-0">
                  {category.items.length}
                </Badge>
              </h4>
              <div className="space-y-1">
                {category.items.map((item, idx) => {
                  const itemId = `${category.category}-${idx}`;
                  const isChecked = checkedItems.has(itemId);

                  return (
                    <div
                      key={itemId}
                      className="flex items-center gap-1.5 p-1 rounded-md hover:bg-muted/50 transition"
                    >
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={() => toggleItem(itemId)}
                        className="h-3.5 w-3.5 flex-shrink-0"
                      />
                      <label
                        className={`flex-1 text-xs cursor-pointer transition ${
                          isChecked ? "line-through text-muted-foreground" : ""
                        }`}
                      >
                        {item}
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-1 pt-2 border-t">
          <Button
            onClick={downloadChecklist}
            variant="outline"
            size="sm"
            className="flex-1 h-6 text-[9px] gap-1"
          >
            <Download className="h-3 w-3" />
            Download
          </Button>
          <Button size="sm" variant="outline" className="flex-1 h-6 text-[9px] gap-1">
            <Plus className="h-3 w-3" />
            Add
          </Button>
        </div>

        {/* Tips */}
        <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 p-2 text-[9px] text-blue-900 dark:text-blue-200">
          <p className="font-medium mb-0.5">💡 Tips</p>
          <ul className="space-y-0.5 list-disc list-inside">
            <li>Roll clothes to save space</li>
            <li>Check baggage limits</li>
            <li>Keep meds in containers</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
