import { useState, useEffect } from "react";
import { OnboardingFlow } from "@/components/OnboardingFlow";
import { SwipeInterface } from "@/components/SwipeInterface";
import { BookmarkedRestaurants } from "@/components/BookmarkedRestaurants";
import { Navigation } from "@/components/Navigation";
import { FilterBar } from "@/components/FilterBar";
import { MapView } from "@/components/MapView";
import { UserPreferences, Restaurant } from "@/types";
import { mockRestaurants, foodTags } from "@/data/mockRestaurants";
import heroImage from "@/assets/hero-food.jpg";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [activeTab, setActiveTab] = useState<"discover" | "bookmarks" | "map" | "profile">("discover");
  const [bookmarked, setBookmarked] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState(mockRestaurants);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([50, 2000]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (preferences) {
      setSelectedTags(preferences.tags);
    }
  }, [preferences]);

  useEffect(() => {
    let filtered = mockRestaurants;
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim().slice(0, 100);
      filtered = filtered.filter((restaurant) =>
        restaurant.name.toLowerCase().includes(query) ||
        restaurant.cuisine.toLowerCase().includes(query) ||
        restaurant.description.toLowerCase().includes(query) ||
        restaurant.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Filter by tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter((restaurant) =>
        restaurant.tags.some((tag) => selectedTags.includes(tag))
      );
    }
    
    // Filter by price range
    filtered = filtered.filter((restaurant) =>
      restaurant.priceMin <= priceRange[1] && restaurant.priceMax >= priceRange[0]
    );
    
    setFilteredRestaurants(filtered);
  }, [selectedTags, priceRange, searchQuery]);

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

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handlePriceRangeChange = (range: [number, number]) => {
    setPriceRange(range);
  };

  if (!preferences) {
    return <OnboardingFlow onComplete={setPreferences} />;
  }

  return (
    <div className="min-h-screen bg-gradient-warm pb-24">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-40 shadow-sm">
        <div className="container max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <img src={logo} alt="Choose Eat" className="h-12 w-auto" />
            <div className="text-sm text-muted-foreground">
              Welcome, {preferences.name}
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

            <FilterBar
              selectedTags={selectedTags}
              onTagToggle={handleTagToggle}
              availableTags={foodTags}
              priceRange={priceRange}
              onPriceRangeChange={handlePriceRangeChange}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />

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
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Name</label>
                  <p className="text-lg">{preferences.name}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Location</label>
                  <p className="text-lg">{preferences.location}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Food Preferences</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {preferences.tags.map((tag) => (
                      <div
                        key={tag}
                        className="px-3 py-1.5 bg-gradient-primary text-primary-foreground rounded-full text-sm font-medium"
                      >
                        {tag}
                      </div>
                    ))}
                  </div>
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

                <div className="pt-4 border-t">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => window.location.href = '/admin'}
                  >
                    Admin Dashboard
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Navigation */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
