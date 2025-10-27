import { useState, useRef, useEffect } from "react";
import { Restaurant } from "@/types";
import { RestaurantCard } from "./RestaurantCard";
import { Info } from "lucide-react";
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
        className="relative h-[600px] touch-none"
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
        />

        {dragOffset.x > 50 && (
          <div className="absolute top-8 right-8 bg-primary text-primary-foreground px-6 py-3 rounded-full font-bold text-lg rotate-12 animate-scale-in pointer-events-none">
            LIKE
          </div>
        )}
        {dragOffset.x < -50 && (
          <div className="absolute top-8 left-8 bg-destructive text-destructive-foreground px-6 py-3 rounded-full font-bold text-lg -rotate-12 animate-scale-in pointer-events-none">
            NOPE
          </div>
        )}
      </div>
    </div>
  );
};
