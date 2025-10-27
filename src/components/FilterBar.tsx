import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { SlidersHorizontal, Search } from "lucide-react";

interface FilterBarProps {
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  availableTags: string[];
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const FilterBar = ({ selectedTags, onTagToggle, availableTags, priceRange, onPriceRangeChange, searchQuery, onSearchChange }: FilterBarProps) => {
  return (
    <div className="bg-card rounded-2xl p-4 shadow-card space-y-4">
      <div className="flex items-center gap-3">
        <SlidersHorizontal className="w-5 h-5 text-primary" />
        <h3 className="font-semibold">Filters</h3>
      </div>
      
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search restaurants, cuisine, or tags..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            maxLength={100}
            className="pl-10"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium">Price Range</label>
            <span className="text-sm text-muted-foreground">
              ₱{priceRange[0]} - ₱{priceRange[1]}
            </span>
          </div>
          <Slider
            min={50}
            max={2000}
            step={50}
            value={priceRange}
            onValueChange={(value) => onPriceRangeChange(value as [number, number])}
            className="w-full"
          />
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
