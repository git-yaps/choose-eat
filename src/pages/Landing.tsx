import { Button } from "@/components/ui/button";
import { Heart, MapPin, Star, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-food.jpg";
import logo from "@/assets/logo.png";

const Landing = () => {
  const handleGetStarted = () => {
    window.location.href = "/app";
  };

  return (
    <div className="min-h-screen bg-gradient-warm">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-40 shadow-sm">
        <div className="container max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <img src={logo} alt="Choose Eat" className="h-12 w-auto" />
            <Button onClick={handleGetStarted} variant="gradient">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container max-w-6xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Find Your Next{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Bite
              </span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Stop scrolling endlessly. Swipe through personalized food
              recommendations and discover amazing restaurants near you.
            </p>
            <div className="flex gap-4">
              <Button onClick={handleGetStarted} size="lg" variant="gradient">
                Start Swiping
              </Button>
            </div>
          </div>
          <div className="relative">
            <div
              className="rounded-3xl overflow-hidden shadow-elegant h-[500px]"
              style={{
                backgroundImage: `url(${heroImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-gradient-card" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            How Choose Eat Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A simple, fun way to discover food that matches your taste
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-card rounded-2xl p-8 shadow-card space-y-4 hover:shadow-elegant transition-shadow">
            <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center">
              <Heart className="w-8 h-8 text-primary-foreground" />
            </div>
            <h3 className="text-2xl font-bold">Swipe to Discover</h3>
            <p className="text-muted-foreground">
              Swipe right on food you love, left on what you don't. Our app
              learns your preferences with every swipe.
            </p>
          </div>

          <div className="bg-card rounded-2xl p-8 shadow-card space-y-4 hover:shadow-elegant transition-shadow">
            <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center">
              <MapPin className="w-8 h-8 text-primary-foreground" />
            </div>
            <h3 className="text-2xl font-bold">Explore Nearby</h3>
            <p className="text-muted-foreground">
              View restaurants on an interactive map, find hidden gems in your
              area, and get directions instantly.
            </p>
          </div>

          <div className="bg-card rounded-2xl p-8 shadow-card space-y-4 hover:shadow-elegant transition-shadow">
            <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center">
              <Star className="w-8 h-8 text-primary-foreground" />
            </div>
            <h3 className="text-2xl font-bold">Save Your Favorites</h3>
            <p className="text-muted-foreground">
              Bookmark restaurants you want to try, rate your experiences, and
              build your personal food collection.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Eat Section */}
      <section className="bg-card/50 backdrop-blur-sm py-20">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-primary" />
                <h2 className="text-4xl font-bold">Why Choose Eat?</h2>
              </div>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <div>
                    <h4 className="font-bold text-lg mb-1">
                      No More Decision Fatigue
                    </h4>
                    <p className="text-muted-foreground">
                      Overwhelmed by too many choices? We make finding food fun
                      and effortless.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <div>
                    <h4 className="font-bold text-lg mb-1">
                      Personalized Just for You
                    </h4>
                    <p className="text-muted-foreground">
                      Set your preferences for cuisine, price range, and dietary
                      needs. Get recommendations that match your taste.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <div>
                    <h4 className="font-bold text-lg mb-1">
                      Discovery, Not Delivery
                    </h4>
                    <p className="text-muted-foreground">
                      We focus on helping you discover great food spots, not
                      just ordering in. Explore local gems and hidden treasures.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-card rounded-2xl p-6 shadow-card">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="font-semibold">Filter by Preferences</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Budget-friendly, Spicy, Vegan, or Fine Dining — filter by what
                  matters to you
                </p>
              </div>
              <div className="bg-card rounded-2xl p-6 shadow-card">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="font-semibold">Interactive Map View</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  See where restaurants are located and plan your food adventures
                </p>
              </div>
              <div className="bg-card rounded-2xl p-6 shadow-card">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-3 h-3 rounded-full bg-orange-500" />
                  <span className="font-semibold">Real Reviews</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Read authentic feedback from fellow food lovers in your community
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container max-w-6xl mx-auto px-4 py-20">
        <div className="bg-gradient-primary rounded-3xl p-12 text-center shadow-elegant">
          <h2 className="text-4xl font-bold text-primary-foreground mb-4">
            Ready to Discover Your Next Favorite Spot?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Join thousands of food lovers finding amazing restaurants with just a
            swipe
          </p>
          <Button
            onClick={handleGetStarted}
            size="lg"
            variant="secondary"
            className="text-lg px-8"
          >
            Get Started Free
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card/80 backdrop-blur-sm border-t border-border py-12">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Choose Eat" className="h-10 w-auto" />
              <span className="text-muted-foreground">
                Find your next bite
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2025 Choose Eat. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
