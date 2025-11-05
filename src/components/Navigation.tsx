import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Home, Bookmark, Map, User, Plus } from "lucide-react";
import { AddRestaurantDialog } from "./AddRestaurantDialog";

interface NavigationProps {
  activeTab: "discover" | "bookmarks" | "map" | "profile";
  onTabChange: (tab: "discover" | "bookmarks" | "map" | "profile") => void;
  onRestaurantAdded?: () => void;
}

export const Navigation = ({ activeTab, onTabChange, onRestaurantAdded }: NavigationProps) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  const tabs = [
    { id: "discover" as const, icon: Home, label: "Discover" },
    { id: "bookmarks" as const, icon: Bookmark, label: "Saved" },
    { id: "map" as const, icon: Map, label: "Map" },
    { id: "profile" as const, icon: User, label: "Profile" },
  ];

  const handleAddPost = () => {
    setIsAddDialogOpen(true);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-sm border-t border-border shadow-float z-[100]">
      <div className="container max-w-2xl mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-between h-16 sm:h-20 relative">
          {tabs.slice(0, 2).map(({ id, icon: Icon, label }) => (
            <Button
              key={id}
              variant="ghost"
              size="sm"
              className={`flex flex-col items-center gap-0.5 sm:gap-1 h-auto py-1.5 sm:py-2 px-2 sm:px-4 transition-all flex-1 min-h-[44px] touch-manipulation ${
                activeTab === id
                  ? "text-primary font-semibold"
                  : "text-muted-foreground"
              }`}
              onClick={() => onTabChange(id)}
            >
              <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${activeTab === id ? "fill-primary" : ""}`} />
              <span className="text-[10px] sm:text-xs leading-tight">{label}</span>
            </Button>
          ))}
          <Button
            variant="gradient"
            size="icon"
            className="h-11 w-11 sm:h-12 sm:w-12 rounded-full shadow-lg flex-shrink-0 min-h-[44px] min-w-[44px] touch-manipulation"
            onClick={handleAddPost}
          >
            <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
          </Button>
          {tabs.slice(2).map(({ id, icon: Icon, label }) => (
            <Button
              key={id}
              variant="ghost"
              size="sm"
              className={`flex flex-col items-center gap-0.5 sm:gap-1 h-auto py-1.5 sm:py-2 px-2 sm:px-4 transition-all flex-1 min-h-[44px] touch-manipulation ${
                activeTab === id
                  ? "text-primary font-semibold"
                  : "text-muted-foreground"
              }`}
              onClick={() => onTabChange(id)}
            >
              <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${activeTab === id ? "fill-primary" : ""}`} />
              <span className="text-[10px] sm:text-xs leading-tight">{label}</span>
            </Button>
          ))}
        </div>
      </div>

      <AddRestaurantDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onRestaurantAdded={onRestaurantAdded}
      />
    </nav>
  );
};
