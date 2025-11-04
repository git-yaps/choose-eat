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
    <nav className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-sm border-t border-border shadow-float z-50">
      <div className="container max-w-2xl mx-auto px-4">
        <div className="flex items-center justify-between h-20 relative">
          {tabs.slice(0, 2).map(({ id, icon: Icon, label }) => (
            <Button
              key={id}
              variant="ghost"
              size="sm"
              className={`flex flex-col items-center gap-1 h-auto py-2 px-4 transition-all flex-1 ${
                activeTab === id
                  ? "text-primary font-semibold"
                  : "text-muted-foreground"
              }`}
              onClick={() => onTabChange(id)}
            >
              <Icon className={`w-6 h-6 ${activeTab === id ? "fill-primary" : ""}`} />
              <span className="text-xs">{label}</span>
            </Button>
          ))}
          <Button
            variant="gradient"
            size="icon"
            className="h-12 w-12 rounded-full shadow-lg flex-shrink-0"
            onClick={handleAddPost}
          >
            <Plus className="w-6 h-6" />
          </Button>
          {tabs.slice(2).map(({ id, icon: Icon, label }) => (
            <Button
              key={id}
              variant="ghost"
              size="sm"
              className={`flex flex-col items-center gap-1 h-auto py-2 px-4 transition-all flex-1 ${
                activeTab === id
                  ? "text-primary font-semibold"
                  : "text-muted-foreground"
              }`}
              onClick={() => onTabChange(id)}
            >
              <Icon className={`w-6 h-6 ${activeTab === id ? "fill-primary" : ""}`} />
              <span className="text-xs">{label}</span>
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
