import { useState, useEffect } from "react";
import { SwipeInterface } from "@/components/SwipeInterface";
import { BookmarkedRestaurants } from "@/components/BookmarkedRestaurants";
import { Navigation } from "@/components/Navigation";
import { MapView } from "@/components/MapView";
import { UserPreferences, Restaurant } from "@/types";
import { mockRestaurants } from "@/data/mockRestaurants";
import heroImage from "@/assets/hero-food.jpg";
import logo from "@/assets/logo.png";
import chooseEatBanner from "@/assets/choose-eat-banner.png";
import { Button } from "@/components/ui/button";
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
import { Loader2, Camera, Edit2, Check, X } from "lucide-react";

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
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [editingName, setEditingName] = useState("");
  const [editingLocation, setEditingLocation] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const MAPBOX_TOKEN = "pk.eyJ1IjoieWFwc3BhY2UiLCJhIjoiY205bzJvNTNoMG9qZDJqcHhxcHhwa3N2dyJ9.DXTcJDikewJBcYjsUPZc7Q";

  useEffect(() => {
    loadUserPreferences();
  }, []);

  // Reload profile data when switching to profile tab to ensure fresh data
  useEffect(() => {
    if (activeTab === "profile" && preferences !== null) {
      // Only reload if we've already loaded data once (not on initial mount)
      loadUserPreferences(false); // Pass false to indicate refresh, not initial load
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  useEffect(() => {
    // Fetch location name if location is a zip code
    const fetchLocationName = async () => {
      if (!preferences?.location) return;
      
      // Check if location is a zip code (numeric)
      const isZipCode = /^\d+$/.test(preferences.location.trim());
      
      if (isZipCode && MAPBOX_TOKEN) {
        try {
          const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${preferences.location}.json?access_token=${MAPBOX_TOKEN}&country=PH&types=postcode`
          );
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
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
          } else {
            // No results found, use the zip code as is
            setLocationName("");
          }
        } catch (error) {
          console.error("Geocoding error:", error);
          // Silently fail - just use the location as entered
          setLocationName("");
        }
      } else {
        // If it's already a city name, use it as is
        setLocationName(preferences.location);
      }
    };

    fetchLocationName();
  }, [preferences?.location]);

  const loadUserPreferences = async (showLoading: boolean = true) => {
    if (showLoading) {
      setLoading(true);
    }
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      console.log("Loading profile for user:", session.user.id);
      
      const { data: profile, error } = await (supabase as any)
        .from("profiles")
        .select("*")
        .eq("user_id", session.user.id)
        .single();

      console.log("Profile query result - profile:", profile);
      console.log("Profile query result - error:", error);

      // Check if profile doesn't exist (common error codes for not found)
      if (error) {
        console.error("Profile query error:", error);
        console.error("Error code:", error.code);
        console.error("Error message:", error.message);
        
        // If profile not found, allow browsing with empty preferences
        if (error.code === "PGRST116" || error.message?.includes("No rows") || error.message?.includes("not found")) {
          console.log("Profile not found, using default values");
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
        console.log("Profile found:", profile);
        console.log("Profile name:", profile.name);
        console.log("Profile city_or_zip_code:", profile.city_or_zip_code);
        // Load preferences from database (allow browsing even without complete preferences)
        const userPreferences: UserPreferences = {
          name: profile.name || "",
          location: profile.city_or_zip_code || "",
          tags: profile.taste_profile || [],
        };
        console.log("Setting userPreferences:", userPreferences);
        setPreferences(userPreferences);
        
        // Load all food preferences (may be empty arrays if not set)
        const foodPrefs = {
          taste_profile: profile.taste_profile || [],
          dietary_preferences: profile.dietary_preferences || [],
          meal_categories: profile.meal_categories || [],
          dining_occasions: profile.dining_occasions || [],
          budget_min: profile.budget_min || null,
          budget_max: profile.budget_max || null,
        };
        console.log("Setting foodPreferences:", foodPrefs);
        setFoodPreferences(foodPrefs);

        // Avatar is not stored in database, keep default or use stored in localStorage
        // Try to get avatar from localStorage, otherwise use default
        const savedAvatar = localStorage.getItem(`avatar_${session.user.id}`);
        if (savedAvatar) {
          setAvatar(savedAvatar);
        } else {
          setAvatar("😊");
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

  // No search filtering - show all restaurants
  useEffect(() => {
    setFilteredRestaurants(mockRestaurants);
  }, []);

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

      // Store avatar in localStorage since it's not in database
      localStorage.setItem(`avatar_${session.user.id}`, selectedAvatar);
      
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

  const handleSaveName = async () => {
    if (!editingName.trim()) {
      toast({
        title: "Error",
        description: "Name cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { error } = await (supabase as any)
        .from("profiles")
        .update({ name: editingName.trim() })
        .eq("user_id", session.user.id);

      if (error) throw error;

      setPreferences((prev) => prev ? { ...prev, name: editingName.trim() } : null);
      setIsEditingName(false);
      toast({
        title: "Name Updated",
        description: "Your name has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update name. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSaveLocation = async () => {
    if (!editingLocation.trim()) {
      toast({
        title: "Error",
        description: "Location cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { error } = await (supabase as any)
        .from("profiles")
        .update({ city_or_zip_code: editingLocation.trim() })
        .eq("user_id", session.user.id);

      if (error) throw error;

      setPreferences((prev) => prev ? { ...prev, location: editingLocation.trim() } : null);
      setIsEditingLocation(false);
      setLocationName(""); // Reset location name to fetch new one
      toast({
        title: "Location Updated",
        description: "Your location has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update location. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancelEditName = () => {
    setEditingName(preferences?.name || "");
    setIsEditingName(false);
  };

  const handleCancelEditLocation = () => {
    setEditingLocation(preferences?.location || "");
    setIsEditingLocation(false);
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
    <div className="min-h-screen bg-gradient-warm pb-16 sm:pb-20">
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
              <div className="text-sm font-medium">
                Hi, {preferences.name}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-2xl mx-auto px-3 sm:px-4 pt-3 sm:pt-4 pb-16 sm:pb-8 space-y-3 sm:space-y-4">
        {activeTab === "discover" && (
          <>
            <div className="w-full rounded-xl sm:rounded-2xl overflow-hidden shadow-card mb-4">
              <img 
                src={chooseEatBanner} 
                alt="Choose Eat Banner" 
                className="w-full h-auto object-cover"
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
          <div className="space-y-3 sm:space-y-6">
            {(() => {
              console.log("Rendering profile tab - preferences:", preferences);
              console.log("Rendering profile tab - avatar:", avatar);
              console.log("Rendering profile tab - locationName:", locationName);
              return null;
            })()}
            <div className="bg-card rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-card space-y-3 sm:space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-2xl font-bold">Your Profile</h2>
              </div>
              
              <div className="space-y-3 sm:space-y-5">
                {/* Avatar and Basic Info */}
                <div className="flex flex-col items-center space-y-3 sm:space-y-5">
                  {/* Centered Avatar */}
                  <div className="relative flex-shrink-0">
                    <Avatar className="h-16 w-16 sm:h-24 sm:w-24">
                      <AvatarFallback className="text-2xl sm:text-4xl bg-gradient-primary">
                        {avatar}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() => setIsAvatarDialogOpen(true)}
                      className="absolute -bottom-1 -right-1 h-6 w-6 sm:h-8 sm:w-8 rounded-full p-0 shadow-md touch-manipulation"
                    >
                      <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                  </div>
                  
                  {/* Name and Location - Centered Horizontal Layout */}
                  <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
                    {/* Name Field */}
                    <div className="flex flex-col items-center space-y-1.5">
                      <label className="text-xs sm:text-sm font-medium text-muted-foreground">Name</label>
                      <p className="text-sm sm:text-base font-medium text-center">{preferences.name}</p>
                    </div>
                    
                    {/* Location Field */}
                    <div className="flex flex-col items-center space-y-1.5">
                      <label className="text-xs sm:text-sm font-medium text-muted-foreground">Location</label>
                      <div className="text-center">
                        <p className="text-sm sm:text-base font-medium">
                          {locationName || preferences.location || "Not set"}
                        </p>
                        {locationName && locationName !== preferences.location && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {preferences.location}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Food Preferences Section */}
                {(foodPreferences && (
                  (foodPreferences.taste_profile && foodPreferences.taste_profile.length > 0) ||
                  (foodPreferences.dietary_preferences && foodPreferences.dietary_preferences.length > 0) ||
                  (foodPreferences.meal_categories && foodPreferences.meal_categories.length > 0) ||
                  (foodPreferences.dining_occasions && foodPreferences.dining_occasions.length > 0) ||
                  (foodPreferences.budget_min !== null && foodPreferences.budget_max !== null)
                )) ? (
                  <div className="pt-3 sm:pt-4 border-t space-y-3 sm:space-y-5">
                    <div className="flex items-center justify-between group">
                      <h3 className="text-sm sm:text-lg font-semibold">Food Preferences</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate("/preferences")}
                        className="h-9 w-9 sm:h-9 sm:w-9 min-h-[44px] min-w-[44px] opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity touch-manipulation"
                        title="Edit Preferences"
                      >
                        <Edit2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      </Button>
                    </div>

                    <div className="space-y-3 sm:space-y-5">
                      {foodPreferences.taste_profile && foodPreferences.taste_profile.length > 0 && (
                        <div>
                          <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1.5 sm:mb-2 block">Taste Profile</label>
                          <div className="flex flex-wrap gap-1.5 sm:gap-2">
                            {foodPreferences.taste_profile.map((taste) => (
                              <div
                                key={taste}
                                className="px-2.5 py-1 sm:px-3 sm:py-1.5 bg-gradient-primary text-primary-foreground rounded-full text-xs sm:text-sm font-medium"
                              >
                                {taste}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {foodPreferences.dietary_preferences && foodPreferences.dietary_preferences.length > 0 && (
                        <div>
                          <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1.5 sm:mb-2 block">Dietary Preferences</label>
                          <div className="flex flex-wrap gap-1.5 sm:gap-2">
                            {foodPreferences.dietary_preferences.map((pref) => (
                              <div
                                key={pref}
                                className="px-2.5 py-1 sm:px-3 sm:py-1.5 bg-gradient-primary text-primary-foreground rounded-full text-xs sm:text-sm font-medium"
                              >
                                {pref}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {foodPreferences.meal_categories && foodPreferences.meal_categories.length > 0 && (
                        <div>
                          <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1.5 sm:mb-2 block">Meal Categories</label>
                          <div className="flex flex-wrap gap-1.5 sm:gap-2">
                            {foodPreferences.meal_categories.map((meal) => (
                              <div
                                key={meal}
                                className="px-2.5 py-1 sm:px-3 sm:py-1.5 bg-gradient-primary text-primary-foreground rounded-full text-xs sm:text-sm font-medium"
                              >
                                {meal}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {foodPreferences.dining_occasions && foodPreferences.dining_occasions.length > 0 && (
                        <div>
                          <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1.5 sm:mb-2 block">Dining Occasions</label>
                          <div className="flex flex-wrap gap-1.5 sm:gap-2">
                            {foodPreferences.dining_occasions.map((occasion) => (
                              <div
                                key={occasion}
                                className="px-2.5 py-1 sm:px-3 sm:py-1.5 bg-gradient-primary text-primary-foreground rounded-full text-xs sm:text-sm font-medium"
                              >
                                {occasion}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {foodPreferences.budget_min !== null && foodPreferences.budget_max !== null && (
                        <div>
                          <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1.5 sm:mb-2 block">Budget Range</label>
                          <p className="text-sm sm:text-base font-medium">
                            ₱{foodPreferences.budget_min.toLocaleString()} - ₱{foodPreferences.budget_max.toLocaleString()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="pt-3 sm:pt-4 border-t">
                    <div className="flex items-center justify-between group">
                      <div>
                        <h3 className="text-sm sm:text-lg font-semibold mb-1">Food Preferences</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">No preferences set yet</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate("/preferences")}
                        className="h-9 w-9 sm:h-9 sm:w-9 min-h-[44px] min-w-[44px] opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity touch-manipulation"
                        title="Set Preferences"
                      >
                        <Edit2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      </Button>
                    </div>
                  </div>
                )}

                <div className="pt-3 sm:pt-4 border-t">
                  <Button
                    variant="destructive"
                    className="w-full text-sm sm:text-base h-11 sm:h-10 min-h-[44px] touch-manipulation"
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
