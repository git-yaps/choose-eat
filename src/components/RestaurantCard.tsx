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
      className="absolute w-full max-w-sm bg-card rounded-2xl overflow-hidden shadow-float cursor-grab active:cursor-grabbing"
      style={style}
    >
      <div className="relative h-80 w-full overflow-hidden bg-muted">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop';
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-card" />
        
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h2 className="text-2xl font-bold mb-1">{restaurant.name}</h2>
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-secondary text-secondary" />
              <span className="font-medium">{restaurant.rating}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{restaurant.distance} mi</span>
            </div>
            <div className="flex items-center">
              <DollarSign className="w-4 h-4" />
              <span>{restaurant.priceRange}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-2">{restaurant.cuisine}</p>
          <p className="text-sm leading-relaxed">{restaurant.description}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {restaurant.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="rounded-full">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};
