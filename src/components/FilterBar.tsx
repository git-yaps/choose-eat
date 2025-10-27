import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, DollarSign } from "lucide-react";

interface FilterBarProps {
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  availableTags: string[];
  selectedPriceRanges: string[];
  onPriceRangeToggle: (priceRange: string) => void;
}

const priceRanges = ["$", "$$", "$$$", "$$$$"];

export const FilterBar = ({ selectedTags, onTagToggle, availableTags, selectedPriceRanges, onPriceRangeToggle }: FilterBarProps) => {
  return (
    <div className="bg-card rounded-2xl p-4 shadow-card space-y-4">
      <div className="flex items-center gap-3">
        <SlidersHorizontal className="w-5 h-5 text-primary" />
        <h3 className="font-semibold">Filters</h3>
      </div>
      
      <div className="space-y-3">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-muted-foreground" />
            <label className="text-sm font-medium">Price Range</label>
          </div>
          <div className="flex flex-wrap gap-2">
            {priceRanges.map((price) => (
              <Badge
                key={price}
                variant={selectedPriceRanges.includes(price) ? "default" : "outline"}
                className={`cursor-pointer py-1.5 px-3 text-xs transition-all hover:scale-105 ${
                  selectedPriceRanges.includes(price) ? "bg-gradient-primary border-0" : ""
                }`}
                onClick={() => onPriceRangeToggle(price)}
              >
                {price}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Cuisine & Preferences</label>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                className={`cursor-pointer py-1.5 px-3 text-xs transition-all hover:scale-105 ${
                  selectedTags.includes(tag) ? "bg-gradient-primary border-0" : ""
                }`}
                onClick={() => onTagToggle(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
