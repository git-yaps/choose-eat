import { useState, useEffect } from "react";
import { SwipeInterface } from "@/components/SwipeInterface";
import { BookmarkedRestaurants } from "@/components/BookmarkedRestaurants";
import { Navigation } from "@/components/Navigation";
import { MapView } from "@/components/MapView";
import { UserPreferences, Restaurant } from "@/types";
import { mockRestaurants } from "@/data/mockRestaurants";
import heroImage from "@/assets/hero-food.jpg";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
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
import { Loader2, Search, Camera } from "lucide-react";

const AVATAR_OPTIONS = [
  "😊", "😎", "🤩", "🥳", "😄", "😃", "😁", "🤗",
  "🤓", "🧐", "😇", "🤠", "🥰", "😍", "😋", "🤤",
  "😏", "😌", "😊", "🙂", "😉", "😗", "😙", "😚",
  "🤔", "🤨", "🧑", "👨", "👩", "👴", "👵", "👶",
  "🧑‍🍳", "👨‍🍳", "👩‍🍳", "🧑‍💼", "👨‍💼", "👩‍💼", "🧑‍🎨", "👨‍🎨"
];

const Index = () => {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [foodPreferences, setFoodPreferences] = useState<{
    taste_profile: string[];
    dietary_preferences: string[];
    meal_categories: string[];
    dining_occasions: string[];
    budget_min: number | null;
    budget_max: number | null;
  } | null>(null);
  const [avatar, setAvatar] = useState<string>("😊");
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"discover" | "bookmarks" | "map" | "profile">("discover");
  const [bookmarked, setBookmarked] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState(mockRestaurants);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationName, setLocationName] = useState<string>("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const MAPBOX_TOKEN = "pk.eyJ1IjoieWFwc3BhY2UiLCJhIjoiY205bzJvNTNoMG9qZDJqcHhxcHhwa3N2dyJ9.DXTcJDikewJBcYjsUPZc7Q";

  useEffect(() => {
    loadUserPreferences();
  }, []);

  useEffect(() => {
    // Fetch location name if location is a zip code
    const fetchLocationName = async () => {
      if (!preferences?.location) return;
      
      // Check if location is a zip code (numeric)
      const isZipCode = /^\d+$/.test(preferences.location.trim());
      
      if (isZipCode) {
        try {
          const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${preferences.location}.json?access_token=${MAPBOX_TOKEN}&country=PH&types=postcode`
          );
          const data = await response.json();
          
          if (data.features && data.features.length > 0) {
            const place = data.features[0];
            const placeName = place.place_name || place.text || "";
            // Extract city/area name from place_name (format: "Postcode, City, Region, Country")
            const parts = placeName.split(",");
            if (parts.length > 1) {
              setLocationName(parts[1].trim());
            } else {
              setLocationName(placeName);
            }
          }
        } catch (error) {
          console.error("Geocoding error:", error);
          setLocationName("");
        }
      } else {
        // If it's already a city name, use it as is
        setLocationName(preferences.location);
      }
    };

    fetchLocationName();
  }, [preferences?.location]);

  const loadUserPreferences = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      const { data: profile, error } = await (supabase as any)
        .from("profiles")
        .select("*")
        .eq("user_id", session.user.id)
        .single();

      // Check if profile doesn't exist (common error codes for not found)
      if (error) {
        // If profile not found, allow browsing with empty preferences
        if (error.code === "PGRST116" || error.message?.includes("No rows") || error.message?.includes("not found")) {
          setPreferences({
            name: "User",
            location: "",
            tags: [],
          });
          setFoodPreferences({
            taste_profile: [],
            dietary_preferences: [],
            meal_categories: [],
            dining_occasions: [],
            budget_min: null,
            budget_max: null,
          });
          setLoading(false);
          return;
        }
        // For other errors, throw to be caught by catch block
        throw error;
      }

      if (profile) {
        // Load preferences from database (allow browsing even without complete preferences)
        const userPreferences: UserPreferences = {
          name: profile.name || "",
          location: profile.city_or_zip_code || "",
          tags: profile.taste_profile || [],
        };
        setPreferences(userPreferences);
        
        // Load all food preferences (may be empty arrays if not set)
        setFoodPreferences({
          taste_profile: profile.taste_profile || [],
          dietary_preferences: profile.dietary_preferences || [],
          meal_categories: profile.meal_categories || [],
          dining_occasions: profile.dining_occasions || [],
          budget_min: profile.budget_min || null,
          budget_max: profile.budget_max || null,
        });

        // Load avatar
        if (profile.avatar) {
          setAvatar(profile.avatar);
        }
      } else {
        // If no profile exists, create a basic one to allow browsing
        // Don't redirect to preferences - allow user to browse
        setPreferences({
          name: "User",
          location: "",
          tags: [],
        });
        setFoodPreferences({
          taste_profile: [],
          dietary_preferences: [],
          meal_categories: [],
          dining_occasions: [],
          budget_min: null,
          budget_max: null,
        });
      }
    } catch (error: any) {
      console.error("Error loading preferences:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to load user preferences. Please try again.",
        variant: "destructive",
      });
      // Allow browsing even if there's an error loading preferences
      setPreferences({
        name: "User",
        location: "",
        tags: [],
      });
      setFoodPreferences({
        taste_profile: [],
        dietary_preferences: [],
        meal_categories: [],
        dining_occasions: [],
        budget_min: null,
        budget_max: null,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = mockRestaurants;
    
    // Filter by search query only
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim().slice(0, 100);
      filtered = filtered.filter((restaurant) =>
        restaurant.name.toLowerCase().includes(query) ||
        restaurant.cuisine.toLowerCase().includes(query) ||
        restaurant.description.toLowerCase().includes(query) ||
        restaurant.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    setFilteredRestaurants(filtered);
  }, [searchQuery]);

  const handleSwipe = (restaurantId: string, direction: "left" | "right") => {
    if (direction === "right") {
      const restaurant = mockRestaurants.find((r) => r.id === restaurantId);
      if (restaurant && !bookmarked.find((r) => r.id === restaurantId)) {
        setBookmarked((prev) => [...prev, restaurant]);
      }
    }
  };

  const handleRemoveBookmark = (id: string) => {
    setBookmarked((prev) => prev.filter((r) => r.id !== id));
  };

  const handleAvatarChange = async (selectedAvatar: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { error } = await (supabase as any)
        .from("profiles")
        .update({ avatar: selectedAvatar })
        .eq("user_id", session.user.id);

      if (error) throw error;

      setAvatar(selectedAvatar);
      setIsAvatarDialogOpen(false);
      toast({
        title: "Avatar Updated",
        description: "Your profile picture has been updated.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update avatar. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Logged out",
        description: "You've been successfully logged out.",
      });
      
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-warm flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!preferences) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-warm pb-20">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-40 shadow-sm">
        <div className="container max-w-2xl mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <img src={logo} alt="Choose Eat" className="h-10 sm:h-12 w-auto" />
            <div className="flex items-center gap-2 sm:gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-lg bg-gradient-primary">
                  {avatar}
                </AvatarFallback>
              </Avatar>
              <div className="text-sm text-muted-foreground">
                Welcome, {preferences.name}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-2xl mx-auto px-3 sm:px-4 pt-3 sm:pt-4 pb-20 sm:pb-8 space-y-3 sm:space-y-4">
        {activeTab === "discover" && (
          <>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search restaurants, cuisine, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                maxLength={100}
                className="pl-10 h-12 text-base"
              />
            </div>

            <SwipeInterface
              restaurants={filteredRestaurants}
              onSwipe={handleSwipe}
            />
          </>
        )}

        {activeTab === "bookmarks" && (
          <BookmarkedRestaurants
            restaurants={bookmarked}
            onRemove={handleRemoveBookmark}
          />
        )}

        {activeTab === "map" && (
          <MapView restaurants={filteredRestaurants} userLocation={preferences.location} />
        )}

        {activeTab === "profile" && (
          <div className="space-y-4">
            <div className="bg-card rounded-2xl p-6 shadow-card space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Your Profile</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/preferences")}
                  className="text-xs h-7 px-3"
                >
                  Edit Profile
                </Button>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="text-xl bg-gradient-primary">
                        {avatar}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() => setIsAvatarDialogOpen(true)}
                      className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full p-0 shadow-md"
                    >
                      <Camera className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <label className="text-[10px] font-medium text-muted-foreground">Name</label>
                        <p className="text-sm truncate">{preferences.name}</p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <label className="text-[10px] font-medium text-muted-foreground">Location</label>
                        <p className="text-sm truncate">
                          {locationName || preferences.location}
                        </p>
                        {locationName && locationName !== preferences.location && (
                          <p className="text-[10px] text-muted-foreground truncate">
                            {preferences.location}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {foodPreferences && (
                  <>
                    {foodPreferences.taste_profile && foodPreferences.taste_profile.length > 0 && (
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Taste Profile</label>
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {foodPreferences.taste_profile.map((taste) => (
                            <div
                              key={taste}
                              className="px-2 py-1 bg-gradient-primary text-primary-foreground rounded-full text-xs font-medium"
                            >
                              {taste}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {foodPreferences.dietary_preferences && foodPreferences.dietary_preferences.length > 0 && (
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Dietary Preferences</label>
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {foodPreferences.dietary_preferences.map((pref) => (
                            <div
                              key={pref}
                              className="px-2 py-1 bg-gradient-primary text-primary-foreground rounded-full text-xs font-medium"
                            >
                              {pref}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {foodPreferences.meal_categories && foodPreferences.meal_categories.length > 0 && (
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Meal Categories</label>
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {foodPreferences.meal_categories.map((meal) => (
                            <div
                              key={meal}
                              className="px-2 py-1 bg-gradient-primary text-primary-foreground rounded-full text-xs font-medium"
                            >
                              {meal}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {foodPreferences.dining_occasions && foodPreferences.dining_occasions.length > 0 && (
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Dining Occasions</label>
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {foodPreferences.dining_occasions.map((occasion) => (
                            <div
                              key={occasion}
                              className="px-2 py-1 bg-gradient-primary text-primary-foreground rounded-full text-xs font-medium"
                            >
                              {occasion}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {foodPreferences.budget_min !== null && foodPreferences.budget_max !== null && (
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Budget Range</label>
                        <p className="text-base mt-1">
                          ₱{foodPreferences.budget_min} - ₱{foodPreferences.budget_max}
                        </p>
                      </div>
                    )}
                  </>
                )}

                <div className="pt-3 border-t">
                  <Button
                    variant="destructive"
                    className="w-full text-sm"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Navigation */}
      <Navigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        onRestaurantAdded={() => {
          // Reload restaurants when a new one is added
          // In a real app, you'd fetch from the database here
          toast({
            title: "Success",
            description: "Restaurant list will be updated shortly.",
          });
        }}
      />

      {/* Avatar Picker Dialog */}
      <Dialog open={isAvatarDialogOpen} onOpenChange={setIsAvatarDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Choose Your Avatar</DialogTitle>
            <DialogDescription>
              Select an avatar for your profile picture
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-6 gap-4 py-4 max-h-[400px] overflow-y-auto">
            {AVATAR_OPTIONS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleAvatarChange(emoji)}
                className={`text-4xl p-4 aspect-square rounded-lg transition-all hover:scale-110 hover:bg-accent flex items-center justify-center ${
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

export default Index;
