import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ChevronRight, Loader2 } from "lucide-react";
import logo from "@/assets/logo.png";

const tasteProfiles = [
  "Sweet", "Savory", "Spicy", "Sour", "Umami", "Bitter", "Smoky", "Tangy"
];

const dietaryPreferences = [
  "Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free", "Keto", "Paleo", 
  "Halal", "Kosher", "Pescatarian", "Low-Carb", "Nut-Free"
];

const mealCategories = [
  "Breakfast", "Brunch", "Lunch", "Dinner", "Dessert", "Snacks", 
  "Coffee & Tea", "Drinks", "Late Night"
];

const diningOccasions = [
  "Casual Dining", "Fine Dining", "Fast Food", "Takeout", "Delivery",
  "Date Night", "Family Meal", "Business Lunch", "Quick Bite", "Food Truck"
];

const Preferences = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedTastes, setSelectedTastes] = useState<string[]>([]);
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [selectedMeals, setSelectedMeals] = useState<string[]>([]);
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([]);
  const [budgetRange, setBudgetRange] = useState<[number, number]>([50, 2000]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuthAndLoadPreferences();
  }, []);

  const checkAuthAndLoadPreferences = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    // Load existing preferences if they exist
    const { data: profile, error: profileError } = await (supabase as any)
      .from("profiles")
      .select("*")
      .eq("user_id", session.user.id)
      .single();

    // If profile doesn't exist, that's okay - user can create it when they save
    if (profileError && profileError.code !== "PGRST116" && !profileError.message?.includes("No rows")) {
      console.error("Error loading profile:", profileError);
      // Still continue - allow user to set preferences
    }

    if (profile) {
      // Load existing preferences into the form
      if (profile.taste_profile) {
        setSelectedTastes(profile.taste_profile);
      }
      if (profile.dietary_preferences) {
        setSelectedDietary(profile.dietary_preferences);
      }
      if (profile.meal_categories) {
        setSelectedMeals(profile.meal_categories);
      }
      if (profile.dining_occasions) {
        setSelectedOccasions(profile.dining_occasions);
      }
      if (profile.budget_min && profile.budget_max) {
        setBudgetRange([profile.budget_min, profile.budget_max]);
      }
    }

    setLoading(false);
  };

  const toggleItem = (
    item: string,
    list: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter(list.includes(item) ? list.filter((i) => i !== item) : [...list, item]);
  };

  const handleSave = async () => {
    if (
      selectedTastes.length === 0 &&
      selectedDietary.length === 0 &&
      selectedMeals.length === 0 &&
      selectedOccasions.length === 0
    ) {
      toast({
        title: "Select Preferences",
        description: "Please select at least one preference from any category.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session found");

      // Get existing profile to preserve name, location, avatar if they exist
      const { data: existingProfile } = await (supabase as any)
        .from("profiles")
        .select("*")
        .eq("user_id", session.user.id)
        .single();

      const profileData: any = {
        user_id: session.user.id,
        taste_profile: selectedTastes,
        dietary_preferences: selectedDietary,
        meal_categories: selectedMeals,
        dining_occasions: selectedOccasions,
        budget_min: budgetRange[0],
        budget_max: budgetRange[1],
      };

      // Preserve name and location if they exist in the existing profile
      if (existingProfile) {
        if (existingProfile.name) profileData.name = existingProfile.name;
        if (existingProfile.city_or_zip_code) profileData.city_or_zip_code = existingProfile.city_or_zip_code;
      } else {
        // If profile doesn't exist, try to get name/location from auth metadata (set during signup)
        const userMetadata = session.user.user_metadata;
        if (userMetadata) {
          if (userMetadata.name) profileData.name = userMetadata.name;
          if (userMetadata.city_or_zip_code) profileData.city_or_zip_code = userMetadata.city_or_zip_code;
        }
        // If still no name, use a default (shouldn't happen if signup flow is correct)
        if (!profileData.name) {
          profileData.name = "User";
        }
        if (!profileData.city_or_zip_code) {
          profileData.city_or_zip_code = "";
        }
      }

      // Use upsert to handle both create and update cases
      const { error } = await (supabase as any)
        .from("profiles")
        .upsert(profileData, { onConflict: "user_id" });

      if (error) throw error;

      toast({
        title: "Profile Updated!",
        description: "Your profile has been saved successfully.",
      });

      navigate("/app");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save profile.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-warm flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-warm p-4 sm:p-6 py-6 sm:py-8">
      <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8 animate-scale-in">
        <div className="text-center space-y-3 sm:space-y-4">
          <img src={logo} alt="Choose Eat" className="h-16 sm:h-20 w-auto mx-auto" />
          <h1 className="text-2xl sm:text-3xl font-black">Your Preferences</h1>
        </div>

        {/* Taste Profile */}
        <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-card space-y-3 sm:space-y-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">Taste Profile</h2>
            <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
              What flavors do you enjoy?
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {tasteProfiles.map((taste) => (
              <Badge
                key={taste}
                variant={selectedTastes.includes(taste) ? "default" : "outline"}
                className={`cursor-pointer py-1.5 px-3 sm:py-2 sm:px-4 text-xs sm:text-sm transition-all hover:scale-105 ${
                  selectedTastes.includes(taste) ? "bg-gradient-primary border-0" : ""
                }`}
                onClick={() => toggleItem(taste, selectedTastes, setSelectedTastes)}
              >
                {taste}
              </Badge>
            ))}
          </div>
        </div>

        {/* Dietary Preferences */}
        <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-card space-y-3 sm:space-y-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">Dietary & Lifestyle Preferences</h2>
            <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
              Any dietary restrictions or preferences?
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {dietaryPreferences.map((pref) => (
              <Badge
                key={pref}
                variant={selectedDietary.includes(pref) ? "default" : "outline"}
                className={`cursor-pointer py-1.5 px-3 sm:py-2 sm:px-4 text-xs sm:text-sm transition-all hover:scale-105 ${
                  selectedDietary.includes(pref) ? "bg-gradient-primary border-0" : ""
                }`}
                onClick={() => toggleItem(pref, selectedDietary, setSelectedDietary)}
              >
                {pref}
              </Badge>
            ))}
          </div>
        </div>

        {/* Budget Range */}
        <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-card space-y-3 sm:space-y-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">Budget Range</h2>
            <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
              What's your typical budget per person?
            </p>
          </div>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex justify-between text-xs sm:text-sm font-medium">
              <span>₱{budgetRange[0]}</span>
              <span>₱{budgetRange[1]}</span>
            </div>
            <Slider
              min={10}
              max={5000}
              step={10}
              value={budgetRange}
              onValueChange={(value) => setBudgetRange(value as [number, number])}
              className="w-full"
            />
          </div>
        </div>

        {/* Meal Categories */}
        <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-card space-y-3 sm:space-y-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">Meal Category</h2>
            <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
              When do you usually eat out?
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {mealCategories.map((meal) => (
              <Badge
                key={meal}
                variant={selectedMeals.includes(meal) ? "default" : "outline"}
                className={`cursor-pointer py-1.5 px-3 sm:py-2 sm:px-4 text-xs sm:text-sm transition-all hover:scale-105 ${
                  selectedMeals.includes(meal) ? "bg-gradient-primary border-0" : ""
                }`}
                onClick={() => toggleItem(meal, selectedMeals, setSelectedMeals)}
              >
                {meal}
              </Badge>
            ))}
          </div>
        </div>

        {/* Dining Occasions */}
        <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-card space-y-3 sm:space-y-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">Dining Occasion</h2>
            <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
              What type of dining experience do you prefer?
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {diningOccasions.map((occasion) => (
              <Badge
                key={occasion}
                variant={selectedOccasions.includes(occasion) ? "default" : "outline"}
                className={`cursor-pointer py-1.5 px-3 sm:py-2 sm:px-4 text-xs sm:text-sm transition-all hover:scale-105 ${
                  selectedOccasions.includes(occasion) ? "bg-gradient-primary border-0" : ""
                }`}
                onClick={() => toggleItem(occasion, selectedOccasions, setSelectedOccasions)}
              >
                {occasion}
              </Badge>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="pb-6 sm:pb-8">
          <Button
            variant="gradient"
            size="lg"
            className="w-full text-sm sm:text-base"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                Start Discovering
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>

    </div>
  );
};

export default Preferences;
