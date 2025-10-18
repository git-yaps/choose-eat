import { useState, useRef, useEffect } from "react";
import { Restaurant } from "@/types";
import { RestaurantCard } from "./RestaurantCard";
import { Button } from "@/components/ui/button";
import { X, Heart, Info } from "lucide-react";
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
  const cardRef = useRef<HTMLDivElement>(null);

  const currentRestaurant = restaurants[currentIndex];

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

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (Math.abs(dragOffset.x) > 100) {
      handleSwipe(dragOffset.x > 0 ? "right" : "left");
    } else {
      setDragOffset({ x: 0, y: 0 });
    }
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mouseup", handleMouseUp as any);
      return () => document.removeEventListener("mouseup", handleMouseUp as any);
    }
  }, [isDragging, dragOffset]);

  if (!currentRestaurant) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] text-center space-y-4">
        <Info className="w-16 h-16 text-muted-foreground" />
        <h3 className="text-2xl font-bold">No more restaurants!</h3>
        <p className="text-muted-foreground">
          Check your bookmarks or adjust your filters
        </p>
      </div>
    );
  }

  const rotation = dragOffset.x / 20;
  const opacity = 1 - Math.abs(dragOffset.x) / 300;

  return (
    <div className="relative w-full max-w-sm mx-auto">
      <div
        className="relative h-[600px]"
        onMouseMove={handleMouseMove}
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
        />
        <div
          className="absolute inset-0 pointer-events-none"
          onMouseDown={handleMouseDown}
        />

        {dragOffset.x > 50 && (
          <div className="absolute top-8 right-8 bg-primary text-primary-foreground px-6 py-3 rounded-full font-bold text-lg rotate-12 animate-scale-in">
            LIKE
          </div>
        )}
        {dragOffset.x < -50 && (
          <div className="absolute top-8 left-8 bg-destructive text-destructive-foreground px-6 py-3 rounded-full font-bold text-lg -rotate-12 animate-scale-in">
            NOPE
          </div>
        )}
      </div>

      <div className="flex justify-center gap-6 mt-8">
        <Button
          variant="swipe"
          size="icon"
          className="h-16 w-16 rounded-full"
          onClick={() => handleSwipe("left")}
        >
          <X className="w-8 h-8 text-destructive" />
        </Button>
        <Button
          variant="swipe"
          size="icon"
          className="h-16 w-16 rounded-full"
          onClick={() => handleSwipe("right")}
        >
          <Heart className="w-8 h-8 text-primary" />
        </Button>
      </div>
    </div>
  );
};
