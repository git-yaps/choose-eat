import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";

interface FilterBarProps {
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  availableTags: string[];
}

export const FilterBar = ({ selectedTags, onTagToggle, availableTags }: FilterBarProps) => {
  return (
    <div className="bg-card rounded-2xl p-4 shadow-card">
      <div className="flex items-center gap-3 mb-3">
        <SlidersHorizontal className="w-5 h-5 text-primary" />
        <h3 className="font-semibold">Filters</h3>
      </div>
      
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
  );
};
