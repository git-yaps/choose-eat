import { Restaurant } from "@/types";
import { Star, MapPin, DollarSign, Navigation, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface RestaurantCardProps {
  restaurant: Restaurant;
  style?: React.CSSProperties;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onGetDirections?: () => void;
  onSeeReviews?: () => void;
  variant?: "swipeable" | "dialog";
}

export const RestaurantCard = ({ restaurant, style, onGetDirections, onSeeReviews, variant = "swipeable" }: RestaurantCardProps) => {
  const handleButtonClick = (e: React.MouseEvent | React.PointerEvent, handler?: () => void) => {
    e.stopPropagation();
    e.preventDefault();
    handler?.();
  };

  const isSwipeable = variant === "swipeable";
  const baseClasses = isSwipeable 
    ? "absolute w-full bg-card rounded-xl sm:rounded-2xl overflow-hidden shadow-float cursor-grab active:cursor-grabbing z-0"
    : "w-full bg-card rounded-xl sm:rounded-2xl overflow-hidden shadow-float";

  return (
    <div
      className={baseClasses}
      style={style}
    >
      <div className="relative h-56 sm:h-64 md:h-72 lg:h-80 w-full overflow-hidden bg-muted">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop';
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-20 sm:h-24 md:h-28 lg:h-32 bg-gradient-card" />
        
        <div className="absolute bottom-2 left-2 right-2 sm:bottom-3 sm:left-3 sm:right-3 md:bottom-4 md:left-4 md:right-4 text-white">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-0.5 sm:mb-1 leading-tight">{restaurant.name}</h2>
          <div className="flex items-center gap-0.5 sm:gap-1 mb-1.5 sm:mb-2 text-[9px] sm:text-[10px] md:text-xs opacity-90">
            <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 flex-shrink-0" />
            <span className="truncate">{restaurant.address}</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 text-[10px] sm:text-xs md:text-sm">
            <div className="flex items-center gap-0.5 sm:gap-1">
              <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 fill-secondary text-secondary flex-shrink-0" />
              <span className="font-medium">{restaurant.rating}</span>
            </div>
            <div className="flex items-center gap-0.5 sm:gap-1">
              <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 flex-shrink-0" />
              <span>{restaurant.distance} mi</span>
            </div>
            <div className="flex items-center">
              <DollarSign className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 flex-shrink-0" />
              <span>{restaurant.priceRange}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-3 sm:p-4 md:p-5 lg:p-6 space-y-2.5 sm:space-y-3 md:space-y-4">
        <div>
          <p className="text-[11px] sm:text-xs md:text-sm text-muted-foreground mb-1 sm:mb-2">{restaurant.cuisine}</p>
          <p className="text-[11px] sm:text-xs md:text-sm leading-relaxed line-clamp-3">{restaurant.description}</p>
        </div>

        <div className="flex flex-wrap gap-1 sm:gap-1.5 md:gap-2">
          {restaurant.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="rounded-full text-[9px] sm:text-[10px] md:text-xs px-1.5 sm:px-2 md:px-2.5 py-0.5 sm:py-1">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="pt-2 flex flex-row gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => handleButtonClick(e, onGetDirections)}
            onPointerDown={(e) => handleButtonClick(e, onGetDirections)}
            className="flex-1 text-[11px] sm:text-xs md:text-sm min-h-[40px] sm:min-h-[36px] touch-manipulation"
          >
            <Navigation className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 mr-1 sm:mr-1.5 md:mr-2" />
            Directions
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => handleButtonClick(e, onSeeReviews)}
            onPointerDown={(e) => handleButtonClick(e, onSeeReviews)}
            className="flex-1 text-[11px] sm:text-xs md:text-sm min-h-[40px] sm:min-h-[36px] touch-manipulation"
          >
            <MessageSquare className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 mr-1 sm:mr-1.5 md:mr-2" />
            Reviews
          </Button>
        </div>
      </div>
    </div>
  );
};
