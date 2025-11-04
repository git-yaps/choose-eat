import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ChevronRight, Loader2, Camera } from "lucide-react";
import logo from "@/assets/logo.png";

const AVATAR_OPTIONS = [
  "😊", "😎", "🤩", "🥳", "😄", "😃", "😁", "🤗",
  "🤓", "🧐", "😇", "🤠", "🥰", "😍", "😋", "🤤",
  "😏", "😌", "😊", "🙂", "😉", "😗", "😙", "😚",
  "🤔", "🤨", "🧑", "👨", "👩", "👴", "👵", "👶",
  "🧑‍🍳", "👨‍🍳", "👩‍🍳", "🧑‍💼", "👨‍💼", "👩‍💼", "🧑‍🎨", "👨‍🎨"
];

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
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [avatar, setAvatar] = useState<string>("😊");
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);
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
    const { data: profile } = await (supabase as any)
      .from("profiles")
      .select("*")
      .eq("user_id", session.user.id)
      .single();

    if (profile) {
      // Load existing profile info
      if (profile.name) {
        setName(profile.name);
      }
      if (profile.city_or_zip_code) {
        setLocation(profile.city_or_zip_code);
      }
      if (profile.avatar) {
        setAvatar(profile.avatar);
      }
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
    if (!name.trim() || !location.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in your name and location.",
        variant: "destructive",
      });
      return;
    }

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

      const { error } = await (supabase as any)
        .from("profiles")
        .update({
          name: name.trim(),
          city_or_zip_code: location.trim(),
          avatar: avatar,
          taste_profile: selectedTastes,
          dietary_preferences: selectedDietary,
          meal_categories: selectedMeals,
          dining_occasions: selectedOccasions,
          budget_min: budgetRange[0],
          budget_max: budgetRange[1],
        })
        .eq("user_id", session.user.id);

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
          <h1 className="text-2xl sm:text-3xl font-bold">Edit Your Profile</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Update your information and food preferences
          </p>
        </div>

        {/* Profile Information */}
        <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-card space-y-3 sm:space-y-4">
          <h2 className="text-lg sm:text-xl font-bold mb-2">Profile Information</h2>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <div className="relative flex-shrink-0">
              <Avatar className="h-14 w-14 sm:h-16 sm:w-16">
                <AvatarFallback className="text-xl sm:text-2xl bg-gradient-primary">
                  {avatar}
                </AvatarFallback>
              </Avatar>
              <Button
                variant="secondary"
                size="icon"
                onClick={() => setIsAvatarDialogOpen(true)}
                className="absolute -bottom-1 -right-1 h-6 w-6 sm:h-7 sm:w-7 rounded-full p-0 shadow-md"
              >
                <Camera className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </Button>
            </div>
            <div className="flex-1 w-full space-y-3 sm:space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-11 sm:h-12 text-sm sm:text-base"
                  required
                  maxLength={100}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Input
                  type="text"
                  placeholder="Enter your city or zip code"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="h-11 sm:h-12 text-sm sm:text-base"
                  required
                  maxLength={100}
                />
              </div>
            </div>
          </div>
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

      {/* Avatar Picker Dialog */}
      <Dialog open={isAvatarDialogOpen} onOpenChange={setIsAvatarDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Choose Your Avatar</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Select an avatar for your profile picture
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-6 sm:grid-cols-6 gap-3 sm:gap-4 py-4 max-h-[50vh] sm:max-h-[400px] overflow-y-auto">
            {AVATAR_OPTIONS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => {
                  setAvatar(emoji);
                  setIsAvatarDialogOpen(false);
                }}
                className={`text-2xl sm:text-3xl md:text-4xl p-2 sm:p-3 md:p-4 aspect-square rounded-lg transition-all hover:scale-110 hover:bg-accent flex items-center justify-center ${
                  avatar === emoji ? "ring-2 ring-primary bg-accent" : ""
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Preferences;
