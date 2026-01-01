import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Star, MapPin, MessageCircle } from "lucide-react";
import { useState } from "react";

interface LocalGuide {
  id: string;
  name: string;
  city: string;
  languages: string[];
  rating: number;
  reviews: number;
  specialties: string[];
  pricePerDay: number;
  image: string;
}

// Sample local guides data
const SAMPLE_GUIDES: { [key: string]: LocalGuide[] } = {
  "New Delhi, India": [
    {
      id: "1",
      name: "Rajesh Kumar",
      city: "Delhi",
      languages: ["English", "Hindi", "Spanish"],
      rating: 4.9,
      reviews: 248,
      specialties: ["History", "Architecture", "Food Tours"],
      pricePerDay: 3500,
      image: "👨",
    },
    {
      id: "2",
      name: "Priya Sharma",
      city: "Delhi",
      languages: ["English", "French", "Hindi"],
      rating: 4.8,
      reviews: 195,
      specialties: ["Street Food", "Markets", "Cultural Sites"],
      pricePerDay: 3000,
      image: "👩",
    },
    {
      id: "3",
      name: "Arjun Singh",
      city: "Delhi",
      languages: ["English", "German", "Hindi"],
      rating: 4.7,
      reviews: 162,
      specialties: ["Photography", "Local Life", "Adventure"],
      pricePerDay: 3500,
      image: "👨",
    },
  ],
  "Paris, France": [
    {
      id: "4",
      name: "Marie Dubois",
      city: "Paris",
      languages: ["French", "English", "Spanish"],
      rating: 4.9,
      reviews: 412,
      specialties: ["Art History", "Museums", "Fashion"],
      pricePerDay: 80,
      image: "👩",
    },
    {
      id: "5",
      name: "Pierre Laurent",
      city: "Paris",
      languages: ["French", "English", "Italian"],
      rating: 4.8,
      reviews: 368,
      specialties: ["Wine Tasting", "Neighborhoods", "Local Cafes"],
      pricePerDay: 85,
      image: "👨",
    },
  ],
  "Tokyo, Japan": [
    {
      id: "6",
      name: "Yuki Tanaka",
      city: "Tokyo",
      languages: ["Japanese", "English", "Mandarin"],
      rating: 4.9,
      reviews: 356,
      specialties: ["Traditional Culture", "Modern Tokyo", "Food"],
      pricePerDay: 100,
      image: "👩",
    },
    {
      id: "7",
      name: "Kenji Yamamoto",
      city: "Tokyo",
      languages: ["Japanese", "English", "Korean"],
      rating: 4.7,
      reviews: 289,
      specialties: ["Anime Culture", "Gaming", "Nightlife"],
      pricePerDay: 95,
      image: "👨",
    },
  ],
};

interface LocalGuidesProps {
  destination: string;
}

export default function LocalGuides({ destination }: LocalGuidesProps) {
  const [selectedGuide, setSelectedGuide] = useState<string | null>(null);

  const guides = SAMPLE_GUIDES[destination] || [];

  if (guides.length === 0) {
    return (
      <Card className="hover:shadow-lg transition">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="h-5 w-5 text-primary" />
            Local Guide Connections
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg bg-muted/50 p-2 text-center text-xs text-muted-foreground">
            No guides available for {destination} yet.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-lg transition">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Users className="h-5 w-5 text-primary" />
          Local Guide Connections
        </CardTitle>
        <p className="text-xs text-muted-foreground mt-1">
          Verified guides in {destination}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {guides.map((guide) => (
            <div
              key={guide.id}
              className={`rounded-lg border p-4 transition cursor-pointer ${
                selectedGuide === guide.id
                  ? "border-primary bg-primary/5"
                  : "hover:border-primary/50"
              }`}
              onClick={() =>
                setSelectedGuide(selectedGuide === guide.id ? null : guide.id)
              }
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">{guide.image}</span>
                    <div>
                      <h4 className="font-semibold">{guide.name}</h4>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">
                          {guide.rating}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ({guide.reviews} reviews)
                        </span>
                      </div>
                    </div>
                  </div>

                  {selectedGuide === guide.id && (
                    <div className="mt-3 space-y-3 animate-in fade-in slide-in-from-top-2">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">
                          Languages
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {guide.languages.map((lang) => (
                            <Badge
                              key={lang}
                              variant="secondary"
                              className="text-xs"
                            >
                              {lang}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">
                          Specialties
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {guide.specialties.map((specialty) => (
                            <Badge
                              key={specialty}
                              variant="outline"
                              className="text-xs"
                            >
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t">
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Price per day
                          </p>
                          <p className="font-semibold">
                            {typeof guide.pricePerDay === "number"
                              ? `$${guide.pricePerDay}`
                              : `₹${guide.pricePerDay}`}
                          </p>
                        </div>
                        <Button size="sm" className="gap-2">
                          <MessageCircle className="h-4 w-4" />
                          Contact
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {!selectedGuide && (
                  <div className="text-right">
                    <p className="text-sm font-semibold">
                      {typeof guide.pricePerDay === "number"
                        ? `$${guide.pricePerDay}`
                        : `₹${guide.pricePerDay}`}
                    </p>
                    <p className="text-xs text-muted-foreground">per day</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
