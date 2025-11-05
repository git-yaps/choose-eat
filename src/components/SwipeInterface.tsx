import { useState, useRef, useEffect } from "react";
import { Restaurant } from "@/types";
import { RestaurantCard } from "./RestaurantCard";
import { ReviewsDialog } from "./ReviewsDialog";
import { Info, Heart, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface SwipeInterfaceProps {
  restaurants: Restaurant[];
  onSwipe: (restaurantId: string, direction: "left" | "right") => void;
}

export const SwipeInterface = ({ restaurants, onSwipe }: SwipeInterfaceProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const currentRestaurant = restaurants[currentIndex];

  const handleGetDirections = (restaurant: Restaurant) => {
    const query = encodeURIComponent(restaurant.address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  const handleSeeReviews = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
  };

  const handleSwipe = (direction: "left" | "right") => {
    if (!currentRestaurant) return;

    onSwipe(currentRestaurant.id, direction);
    
    if (direction === "right") {
      toast({
        title: "Added to favorites! ❤️",
        description: `${currentRestaurant.name} has been bookmarked`,
      });
    }

    setCurrentIndex((prev) => prev + 1);
    setDragOffset({ x: 0, y: 0 });
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const swipeThreshold = 100;
    if (Math.abs(dragOffset.x) > swipeThreshold) {
      handleSwipe(dragOffset.x > 0 ? "right" : "left");
    } else {
      setDragOffset({ x: 0, y: 0 });
    }
  };

  useEffect(() => {
    if (isDragging) {
      const handleGlobalPointerUp = () => handlePointerUp();
      document.addEventListener("pointerup", handleGlobalPointerUp);
      return () => document.removeEventListener("pointerup", handleGlobalPointerUp);
    }
  }, [isDragging, dragOffset]);

  if (!currentRestaurant) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] sm:h-[600px] text-center space-y-4 px-4">
        <Info className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground" />
        <h3 className="text-xl sm:text-2xl font-bold">No more restaurants!</h3>
        <p className="text-sm sm:text-base text-muted-foreground">
          Check your bookmarks or adjust your filters
        </p>
      </div>
    );
  }

  const rotation = dragOffset.x / 20;
  const opacity = 1 - Math.abs(dragOffset.x) / 300;

  return (
    <div className="relative w-full pb-0 z-0">
      <div
        className="relative h-[500px] sm:h-[550px] md:h-[600px] touch-none z-0"
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerDown}
        ref={cardRef}
      >
        <RestaurantCard
          restaurant={currentRestaurant}
          style={{
            transform: `translateX(${dragOffset.x}px) translateY(${dragOffset.y}px) rotate(${rotation}deg)`,
            opacity,
            transition: isDragging ? "none" : "all 0.3s ease-out",
          }}
          onSwipeLeft={() => handleSwipe("left")}
          onSwipeRight={() => handleSwipe("right")}
          onGetDirections={() => handleGetDirections(currentRestaurant)}
          onSeeReviews={() => handleSeeReviews(currentRestaurant)}
        />

        {dragOffset.x > 50 && (
          <div className="absolute top-4 right-4 sm:top-8 sm:right-8 bg-primary text-primary-foreground p-3 sm:p-4 rounded-full rotate-12 animate-scale-in pointer-events-none shadow-lg">
            <Heart className="w-6 h-6 sm:w-8 sm:h-8 fill-current" />
          </div>
        )}
        {dragOffset.x < -50 && (
          <div className="absolute top-4 left-4 sm:top-8 sm:left-8 bg-destructive text-destructive-foreground p-3 sm:p-4 rounded-full -rotate-12 animate-scale-in pointer-events-none shadow-lg">
            <X className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
        )}
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
