import { Restaurant } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, DollarSign, Navigation, MessageSquare } from "lucide-react";
import { ReviewsDialog } from "./ReviewsDialog";
import { useState } from "react";

interface RestaurantDetailsDialogProps {
  restaurant: Restaurant;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRemove?: (id: string) => void;
}

export const RestaurantDetailsDialog = ({
  restaurant,
  open,
  onOpenChange,
  onRemove,
}: RestaurantDetailsDialogProps) => {
  const [showReviews, setShowReviews] = useState(false);

  const handleGetDirections = () => {
    const query = encodeURIComponent(restaurant.address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 mx-4 sm:mx-0">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl">{restaurant.name}</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">{restaurant.cuisine} • {restaurant.address}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 sm:space-y-6">
            {/* Restaurant Image */}
            <div className="relative w-full h-48 sm:h-64 md:h-80 rounded-lg overflow-hidden bg-muted">
              <img
                src={restaurant.image}
                alt={restaurant.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop';
                }}
              />
            </div>

            {/* Restaurant Info */}
            <div className="space-y-3 sm:space-y-4">
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-secondary text-secondary" />
                  <span className="font-medium">{restaurant.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>{restaurant.distance} mi</span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>{restaurant.priceRange}</span>
                </div>
                <div className="text-primary font-semibold text-xs sm:text-sm">
                  ₱{restaurant.priceMin} - ₱{restaurant.priceMax}
                </div>
              </div>

              {/* Description */}
              <div>
                <p className="text-xs sm:text-sm leading-relaxed">{restaurant.description}</p>
              </div>

              {/* Tags */}
              <div>
                <h4 className="text-xs sm:text-sm font-semibold mb-2">Tags</h4>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {restaurant.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="rounded-full text-[10px] sm:text-xs px-2 py-0.5 sm:px-2.5 sm:py-1">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGetDirections}
                  className="flex-1 text-xs sm:text-sm min-h-[44px] touch-manipulation"
                >
                  <Navigation className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                  <span className="sm:inline">Get Directions</span>
                  <span className="sm:hidden">Directions</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowReviews(true);
                    onOpenChange(false);
                  }}
                  className="flex-1 text-xs sm:text-sm min-h-[44px] touch-manipulation"
                >
                  <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                  <span className="sm:inline">See Reviews</span>
                  <span className="sm:hidden">Reviews</span>
                </Button>
              </div>

              {/* Remove Button (if in bookmarks) */}
              {onRemove && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    onRemove(restaurant.id);
                    onOpenChange(false);
                  }}
                  className="w-full text-xs sm:text-sm min-h-[44px] touch-manipulation"
                >
                  Remove from Bookmarks
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {showReviews && (
        <ReviewsDialog
          restaurant={restaurant}
          open={showReviews}
          onOpenChange={(open) => {
            setShowReviews(open);
            if (!open) {
              onOpenChange(false);
            }
          }}
        />
      )}
    </>
  );
};

