import { Restaurant } from "@/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MapViewProps {
  restaurants: Restaurant[];
  userLocation: string;
}

export const MapView = ({ restaurants, userLocation }: MapViewProps) => {
  const handleGetDirections = (restaurant: Restaurant) => {
    const query = encodeURIComponent(restaurant.address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Nearby Restaurants</h2>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span>{userLocation}</span>
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="relative h-64 bg-muted rounded-2xl overflow-hidden border-2 border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
          <div className="text-center space-y-2">
            <MapPin className="w-12 h-12 mx-auto text-primary" />
            <p className="text-sm text-muted-foreground">Interactive map coming soon</p>
          </div>
        </div>
        
        {/* Map Markers Preview */}
        {restaurants.slice(0, 3).map((restaurant, index) => (
          <div
            key={restaurant.id}
            className="absolute"
            style={{
              left: `${30 + index * 20}%`,
              top: `${40 + index * 10}%`,
            }}
          >
            <div className="relative">
              <MapPin className="w-8 h-8 text-primary fill-primary animate-bounce" />
              <span className="absolute -top-1 -right-1 bg-secondary text-secondary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                {index + 1}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Restaurant List */}
      <div className="grid gap-4">
        {restaurants.map((restaurant, index) => (
          <Card key={restaurant.id} className="overflow-hidden hover:shadow-float transition-shadow">
            <div className="flex gap-4 p-4">
              <div className="relative">
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-24 h-24 rounded-lg object-cover"
                />
                <div className="absolute -top-2 -left-2 bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </div>
              </div>
              
              <div className="flex-1 space-y-2">
                <div>
                  <h3 className="font-semibold text-lg">{restaurant.name}</h3>
                  <p className="text-sm text-muted-foreground">{restaurant.cuisine}</p>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-secondary text-secondary" />
                    <span>{restaurant.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{restaurant.distance} mi</span>
                  </div>
                  <Badge variant="secondary">{restaurant.priceRange}</Badge>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleGetDirections(restaurant)}
                  className="w-full"
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Get Directions
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
