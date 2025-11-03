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
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadUserPreferences();
  }, []);

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

      if (error) throw error;

      if (profile) {
        // Load preferences from database
        const userPreferences: UserPreferences = {
          name: profile.name || "",
          location: profile.city_or_zip_code || "",
          tags: profile.taste_profile || [],
        };
        setPreferences(userPreferences);
        
        // Load all food preferences
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
        // If no profile exists, redirect to preferences
        navigate("/preferences");
      }
    } catch (error: any) {
      console.error("Error loading preferences:", error);
      toast({
        title: "Error",
        description: "Failed to load user preferences. Please try again.",
        variant: "destructive",
      });
      navigate("/auth");
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
      
      navigate("/auth");
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
    <div className="min-h-screen bg-gradient-warm pb-24">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-40 shadow-sm">
        <div className="container max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <img src={logo} alt="Choose Eat" className="h-12 w-auto" />
            <div className="flex items-center gap-3">
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
      <main className="container max-w-2xl mx-auto px-4 py-8 space-y-6">
        {activeTab === "discover" && (
          <>
            <div
              className="relative h-32 rounded-2xl overflow-hidden shadow-card"
              style={{
                backgroundImage: `url(${heroImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-gradient-card flex items-center justify-center">
                <p className="text-white text-xl font-semibold text-center px-4">
                  Swipe to find your next favorite spot
                </p>
              </div>
            </div>

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
          <div className="space-y-6">
            <div className="bg-card rounded-2xl p-8 shadow-card space-y-4">
              <h2 className="text-2xl font-bold">Your Profile</h2>
              
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarFallback className="text-3xl bg-gradient-primary">
                      {avatar}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsAvatarDialogOpen(true)}
                    className="flex items-center gap-2"
                  >
                    <Camera className="w-4 h-4" />
                    Change Avatar
                  </Button>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Name</label>
                  <p className="text-lg">{preferences.name}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Location</label>
                  <p className="text-lg">{preferences.location}</p>
                </div>

                {foodPreferences && (
                  <>
                    {foodPreferences.taste_profile && foodPreferences.taste_profile.length > 0 && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Taste Profile</label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {foodPreferences.taste_profile.map((taste) => (
                            <div
                              key={taste}
                              className="px-3 py-1.5 bg-gradient-primary text-primary-foreground rounded-full text-sm font-medium"
                            >
                              {taste}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {foodPreferences.dietary_preferences && foodPreferences.dietary_preferences.length > 0 && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Dietary Preferences</label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {foodPreferences.dietary_preferences.map((pref) => (
                            <div
                              key={pref}
                              className="px-3 py-1.5 bg-gradient-primary text-primary-foreground rounded-full text-sm font-medium"
                            >
                              {pref}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {foodPreferences.meal_categories && foodPreferences.meal_categories.length > 0 && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Meal Categories</label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {foodPreferences.meal_categories.map((meal) => (
                            <div
                              key={meal}
                              className="px-3 py-1.5 bg-gradient-primary text-primary-foreground rounded-full text-sm font-medium"
                            >
                              {meal}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {foodPreferences.dining_occasions && foodPreferences.dining_occasions.length > 0 && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Dining Occasions</label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {foodPreferences.dining_occasions.map((occasion) => (
                            <div
                              key={occasion}
                              className="px-3 py-1.5 bg-gradient-primary text-primary-foreground rounded-full text-sm font-medium"
                            >
                              {occasion}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {foodPreferences.budget_min !== null && foodPreferences.budget_max !== null && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Budget Range</label>
                        <p className="text-lg mt-1">
                          ₱{foodPreferences.budget_min} - ₱{foodPreferences.budget_max}
                        </p>
                      </div>
                    )}
                  </>
                )}

                <div className="pt-4 border-t">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate("/preferences")}
                  >
                    Edit Preferences
                  </Button>
                </div>

                <div className="pt-4 border-t">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-3xl font-bold text-primary">{bookmarked.length}</p>
                      <p className="text-sm text-muted-foreground">Saved Restaurants</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-primary">{filteredRestaurants.length}</p>
                      <p className="text-sm text-muted-foreground">Restaurants to Explore</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t space-y-3">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => window.location.href = '/admin'}
                  >
                    Admin Dashboard
                  </Button>
                  <Button
                    variant="destructive"
                    className="w-full"
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
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Avatar Picker Dialog */}
      <Dialog open={isAvatarDialogOpen} onOpenChange={setIsAvatarDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Choose Your Avatar</DialogTitle>
            <DialogDescription>
              Select an avatar for your profile picture
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-8 gap-3 py-4 max-h-[400px] overflow-y-auto">
            {AVATAR_OPTIONS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleAvatarChange(emoji)}
                className={`text-3xl p-3 rounded-lg transition-all hover:scale-110 hover:bg-accent ${
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
