import { useState } from "react";
import { Restaurant } from "@/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, DollarSign, Trash2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReviewsDialog } from "@/components/ReviewsDialog";

interface BookmarkedRestaurantsProps {
  restaurants: Restaurant[];
  onRemove: (id: string) => void;
}

export const BookmarkedRestaurants = ({
  restaurants,
  onRemove,
}: BookmarkedRestaurantsProps) => {
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);

  if (restaurants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <Bookmark className="w-16 h-16 text-muted-foreground mb-4" />
        <h3 className="text-2xl font-bold mb-2">No saved restaurants yet</h3>
        <p className="text-muted-foreground">
          Start swiping to find places you love!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold">Your Saved Restaurants</h2>
      <div className="grid gap-3">
        {restaurants.map((restaurant) => (
          <Card key={restaurant.id} className="overflow-hidden hover:shadow-float transition-shadow">
            <div className="flex gap-3 p-3">
              <img
                src={restaurant.image}
                alt={restaurant.name}
                className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop';
                }}
              />
              
              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base leading-tight truncate">{restaurant.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{restaurant.cuisine}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemove(restaurant.id)}
                    className="text-destructive hover:text-destructive h-8 w-8 flex-shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>

                <div className="flex items-center gap-2.5 text-xs">
                  <div className="flex items-center gap-0.5">
                    <Star className="w-3 h-3 fill-secondary text-secondary" />
                    <span>{restaurant.rating}</span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <MapPin className="w-3 h-3" />
                    <span>{restaurant.distance} mi</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="w-3 h-3" />
                    <span>{restaurant.priceRange}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1 flex-1 min-w-0">
                    {restaurant.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0.5 h-auto leading-tight">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedRestaurant(restaurant)}
                    className="h-7 px-2 text-xs flex-shrink-0"
                  >
                    <MessageSquare className="w-3 h-3 mr-1" />
                    Review
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {selectedRestaurant && (
        <ReviewsDialog
          restaurant={selectedRestaurant}
          open={!!selectedRestaurant}
          onOpenChange={(open) => !open && setSelectedRestaurant(null)}
        />
      )}
    </div>
  );
};

const Bookmark = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
  </svg>
);
