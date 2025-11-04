import { Restaurant } from "@/types";
import { Star, MapPin, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RestaurantCardProps {
  restaurant: Restaurant;
  style?: React.CSSProperties;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

export const RestaurantCard = ({ restaurant, style }: RestaurantCardProps) => {
  return (
    <div
      className="absolute w-full max-w-xs sm:max-w-sm md:max-w-md bg-card rounded-xl sm:rounded-2xl overflow-hidden shadow-float cursor-grab active:cursor-grabbing"
      style={style}
    >
      <div className="relative h-64 sm:h-72 md:h-80 w-full overflow-hidden bg-muted">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop';
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-24 sm:h-28 md:h-32 bg-gradient-card" />
        
        <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 text-white">
          <h2 className="text-xl sm:text-2xl font-bold mb-1 leading-tight">{restaurant.name}</h2>
          <div className="flex items-center gap-1 mb-2 text-[10px] sm:text-xs opacity-90">
            <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
            <span className="truncate">{restaurant.address}</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-secondary text-secondary flex-shrink-0" />
              <span className="font-medium">{restaurant.rating}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
              <span>{restaurant.distance} mi</span>
            </div>
            <div className="flex items-center">
              <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
              <span>{restaurant.priceRange}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-5 md:p-6 space-y-3 sm:space-y-4">
        <div>
          <p className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">{restaurant.cuisine}</p>
          <p className="text-xs sm:text-sm leading-relaxed line-clamp-3">{restaurant.description}</p>
        </div>

        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {restaurant.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="rounded-full text-[10px] sm:text-xs px-2 py-0.5 sm:px-2.5 sm:py-1">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};
