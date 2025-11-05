import { useState } from "react";
import { Restaurant } from "@/types";
import { Card } from "@/components/ui/card";
import { Star, MapPin, DollarSign, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RestaurantCard } from "@/components/RestaurantCard";
import { ReviewsDialog } from "@/components/ReviewsDialog";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

interface BookmarkedRestaurantsProps {
  restaurants: Restaurant[];
  onRemove: (id: string) => void;
}

export const BookmarkedRestaurants = ({
  restaurants,
  onRemove,
}: BookmarkedRestaurantsProps) => {
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [showReviews, setShowReviews] = useState(false);

  const handleGetDirections = (restaurant: Restaurant) => {
    const query = encodeURIComponent(restaurant.address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

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
          <Card 
            key={restaurant.id} 
            className="overflow-hidden hover:shadow-float transition-shadow cursor-pointer"
            onClick={() => setSelectedRestaurant(restaurant)}
          >
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
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(restaurant.id);
                    }}
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
              </div>
            </div>
          </Card>
        ))}
      </div>

      {selectedRestaurant && (
        <>
          <Dialog open={!!selectedRestaurant} onOpenChange={(open) => !open && setSelectedRestaurant(null)}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-2 sm:p-4 md:p-6 w-[calc(100%-0.5rem)] sm:w-[calc(100%-2rem)] md:w-full max-w-[98vw] sm:max-w-2xl mx-auto">
              <div className="relative w-full flex justify-center items-center">
                <div className="w-full max-w-full">
                  <RestaurantCard
                    restaurant={selectedRestaurant}
                    variant="dialog"
                    onGetDirections={() => handleGetDirections(selectedRestaurant)}
                    onSeeReviews={() => {
                      setShowReviews(true);
                      setSelectedRestaurant(null);
                    }}
                  />
                </div>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  onRemove(selectedRestaurant.id);
                  setSelectedRestaurant(null);
                }}
                className="w-full text-xs sm:text-sm min-h-[44px] touch-manipulation mt-4"
              >
                Remove from Bookmarks
              </Button>
            </DialogContent>
          </Dialog>

          {showReviews && (
            <ReviewsDialog
              restaurant={selectedRestaurant}
              open={showReviews}
              onOpenChange={(open) => {
                setShowReviews(open);
                if (!open) {
                  setSelectedRestaurant(null);
                }
              }}
            />
          )}
        </>
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
