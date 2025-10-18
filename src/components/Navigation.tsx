import { Button } from "@/components/ui/button";
import { Home, Bookmark, Map, User } from "lucide-react";

interface NavigationProps {
  activeTab: "discover" | "bookmarks" | "map" | "profile";
  onTabChange: (tab: "discover" | "bookmarks" | "map" | "profile") => void;
}

export const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const tabs = [
    { id: "discover" as const, icon: Home, label: "Discover" },
    { id: "bookmarks" as const, icon: Bookmark, label: "Saved" },
    { id: "map" as const, icon: Map, label: "Map" },
    { id: "profile" as const, icon: User, label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-float z-50">
      <div className="container max-w-2xl mx-auto px-4">
        <div className="flex justify-around items-center h-20">
          {tabs.map(({ id, icon: Icon, label }) => (
            <Button
              key={id}
              variant="ghost"
              size="sm"
              className={`flex flex-col items-center gap-1 h-auto py-2 px-4 transition-all ${
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
    </nav>
  );
};
