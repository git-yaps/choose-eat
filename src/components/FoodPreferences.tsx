import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { ChevronRight } from "lucide-react";

interface FoodPreferencesProps {
  onComplete: (preferences: {
    tasteProfile: string[];
    dietaryPreferences: string[];
    budgetMin: number;
    budgetMax: number;
    mealCategories: string[];
    diningOccasions: string[];
  }) => void;
}

const tasteProfiles = [
  "Sweet", "Savory", "Spicy", "Sour", "Umami", "Bitter",
  "Rich", "Light", "Creamy", "Tangy"
];

const dietaryOptions = [
  "Vegetarian", "Vegan", "Pescatarian", "Keto", "Paleo",
  "Gluten-Free", "Dairy-Free", "Halal", "Kosher", "Low-Carb"
];

const mealCategories = [
  "Breakfast", "Brunch", "Lunch", "Dinner", "Snacks",
  "Desserts", "Late Night", "All-Day"
];

const diningOccasions = [
  "Casual Dining", "Date Night", "Family Gathering", "Business Meal",
  "Quick Bite", "Celebration", "Solo Dining", "Group Hangout"
];

export const FoodPreferences = ({ onComplete }: FoodPreferencesProps) => {
  const [step, setStep] = useState(1);
  const [tasteProfile, setTasteProfile] = useState<string[]>([]);
  const [dietaryPreferences, setDietaryPreferences] = useState<string[]>([]);
  const [budgetRange, setBudgetRange] = useState<number[]>([50, 2000]);
  const [mealCategories, setMealCategories] = useState<string[]>([]);
  const [diningOccasions, setDiningOccasions] = useState<string[]>([]);

  const toggleItem = (item: string, list: string[], setter: (list: string[]) => void) => {
    setter(list.includes(item) ? list.filter(i => i !== item) : [...list, item]);
  };

  const handleComplete = () => {
    onComplete({
      tasteProfile,
      dietaryPreferences,
      budgetMin: budgetRange[0],
      budgetMax: budgetRange[1],
      mealCategories,
      diningOccasions,
    });
  };

  return (
    <div className="space-y-6 animate-scale-in">
      {step === 1 && (
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">What's Your Taste?</h2>
            <p className="text-muted-foreground">
              Select your taste preferences (choose at least 2)
            </p>
          </div>

          <div className="bg-card rounded-2xl p-8 shadow-card space-y-6">
            <div className="flex flex-wrap gap-2">
              {tasteProfiles.map(taste => (
                <Badge
                  key={taste}
                  variant={tasteProfile.includes(taste) ? "default" : "outline"}
                  className={`cursor-pointer py-2 px-4 text-sm transition-all hover:scale-105 ${
                    tasteProfile.includes(taste) ? "bg-gradient-primary border-0" : ""
                  }`}
                  onClick={() => toggleItem(taste, tasteProfile, setTasteProfile)}
                >
                  {taste}
                </Badge>
              ))}
            </div>

            <Button
              variant="gradient"
              size="lg"
              className="w-full"
              onClick={() => setStep(2)}
              disabled={tasteProfile.length < 2}
            >
              Continue
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">Dietary Preferences</h2>
            <p className="text-muted-foreground">
              Any dietary restrictions or lifestyle choices? (optional)
            </p>
          </div>

          <div className="bg-card rounded-2xl p-8 shadow-card space-y-6">
            <div className="flex flex-wrap gap-2">
              {dietaryOptions.map(diet => (
                <Badge
                  key={diet}
                  variant={dietaryPreferences.includes(diet) ? "default" : "outline"}
                  className={`cursor-pointer py-2 px-4 text-sm transition-all hover:scale-105 ${
                    dietaryPreferences.includes(diet) ? "bg-gradient-primary border-0" : ""
                  }`}
                  onClick={() => toggleItem(diet, dietaryPreferences, setDietaryPreferences)}
                >
                  {diet}
                </Badge>
              ))}
            </div>

            <Button
              variant="gradient"
              size="lg"
              className="w-full"
              onClick={() => setStep(3)}
            >
              Continue
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">Budget Range</h2>
            <p className="text-muted-foreground">
              What's your typical spending range per meal?
            </p>
          </div>

          <div className="bg-card rounded-2xl p-8 shadow-card space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="font-medium">₱{budgetRange[0]}</span>
                <span className="font-medium">₱{budgetRange[1]}</span>
              </div>
              <Slider
                min={50}
                max={2000}
                step={50}
                value={budgetRange}
                onValueChange={setBudgetRange}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground text-center">
                Drag to adjust your budget range
              </p>
            </div>

            <Button
              variant="gradient"
              size="lg"
              className="w-full"
              onClick={() => setStep(4)}
            >
              Continue
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">Meal Categories</h2>
            <p className="text-muted-foreground">
              What meals are you looking for? (choose at least 1)
            </p>
          </div>

          <div className="bg-card rounded-2xl p-8 shadow-card space-y-6">
            <div className="flex flex-wrap gap-2">
              {mealCategories.map(category => (
                <Badge
                  key={category}
                  variant={mealCategories.includes(category) ? "default" : "outline"}
                  className={`cursor-pointer py-2 px-4 text-sm transition-all hover:scale-105 ${
                    mealCategories.includes(category) ? "bg-gradient-primary border-0" : ""
                  }`}
                  onClick={() => toggleItem(category, mealCategories, setMealCategories)}
                >
                  {category}
                </Badge>
              ))}
            </div>

            <Button
              variant="gradient"
              size="lg"
              className="w-full"
              onClick={() => setStep(5)}
              disabled={mealCategories.length < 1}
            >
              Continue
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      )}

      {step === 5 && (
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">Dining Occasions</h2>
            <p className="text-muted-foreground">
              When do you usually eat out? (choose at least 1)
            </p>
          </div>

          <div className="bg-card rounded-2xl p-8 shadow-card space-y-6">
            <div className="flex flex-wrap gap-2">
              {diningOccasions.map(occasion => (
                <Badge
                  key={occasion}
                  variant={diningOccasions.includes(occasion) ? "default" : "outline"}
                  className={`cursor-pointer py-2 px-4 text-sm transition-all hover:scale-105 ${
                    diningOccasions.includes(occasion) ? "bg-gradient-primary border-0" : ""
                  }`}
                  onClick={() => toggleItem(occasion, diningOccasions, setDiningOccasions)}
                >
                  {occasion}
                </Badge>
              ))}
            </div>

            <Button
              variant="gradient"
              size="lg"
              className="w-full"
              onClick={handleComplete}
              disabled={diningOccasions.length < 1}
            >
              Start Discovering
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
