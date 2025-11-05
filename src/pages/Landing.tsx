import { Button } from "@/components/ui/button";
import { Heart, MapPin, Star, Sparkles } from "lucide-react";
import heroImage from "@/assets/poster.png";
import logo from "@/assets/logo.png";
import logotype from "@/assets/logotype.png";
import horizontalLogo from "@/assets/horizontal-logo.png";
import logomark_bg from "@/assets/logomark_bg.png";

const Landing = () => {
  const handleGetStarted = () => {
    window.location.href = "/auth";
  };

  return (
    <div className="min-h-screen bg-gradient-warm">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-40 shadow-sm">
        <div className="container max-w-6xl mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <img src={logo} alt="Choose Eat" className="h-8 sm:h-10 md:h-12 w-auto" />
              <img src={logotype} alt="Choose Eat" className="h-6 sm:h-8 md:h-10 w-auto hidden sm:block" />
            </div>
            <Button onClick={handleGetStarted} variant="gradient" size="sm" className="text-xs sm:text-sm">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container max-w-6xl mx-auto px-4 py-12 sm:py-16 md:py-20">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="space-y-4 sm:space-y-6">
            <img src={logo} alt="Choose Eat" className="h-32 sm:h-40 md:h-48 w-auto mb-4" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Find Your Next{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Bite
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
              Stop scrolling endlessly. Swipe through personalized food
              recommendations and discover amazing restaurants near you.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button onClick={handleGetStarted} size="lg" variant="gradient" className="text-sm sm:text-base">
                Start Swiping
              </Button>
            </div>
          </div>
          <div className="relative mt-8 md:mt-0">
            <div
              className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-elegant h-[300px] sm:h-[400px] md:h-[500px] w-full aspect-square"
              style={{
                backgroundImage: `url(${heroImage})`,
                backgroundSize: "contain",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container max-w-6xl mx-auto px-4 py-12 sm:py-16 md:py-20">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
            How Choose Eat Works
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            A simple, fun way to discover food that matches your taste
          </p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="bg-card rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-card space-y-3 sm:space-y-4 hover:shadow-elegant transition-shadow">
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-gradient-primary flex items-center justify-center">
              <Heart className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-primary-foreground" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold">Swipe to Discover</h3>
            <p className="text-sm sm:text-base text-muted-foreground">
              Swipe right on food you love, left on what you don't. Our app
              learns your preferences with every swipe.
            </p>
          </div>

          <div className="bg-card rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-card space-y-3 sm:space-y-4 hover:shadow-elegant transition-shadow">
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-gradient-primary flex items-center justify-center">
              <MapPin className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-primary-foreground" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold">Explore Nearby</h3>
            <p className="text-sm sm:text-base text-muted-foreground">
              View restaurants on an interactive map, find hidden gems in your
              area, and get directions instantly.
            </p>
          </div>

          <div className="bg-card rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-card space-y-3 sm:space-y-4 hover:shadow-elegant transition-shadow sm:col-span-2 md:col-span-1">
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-gradient-primary flex items-center justify-center">
              <Star className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-primary-foreground" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold">Save Your Favorites</h3>
            <p className="text-sm sm:text-base text-muted-foreground">
              Bookmark restaurants you want to try, rate your experiences, and
              build your personal food collection.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Eat Section */}
      <section className="bg-card/50 backdrop-blur-sm py-12 sm:py-16 md:py-20">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-primary" />
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">Why Choose Eat?</h2>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex gap-3 sm:gap-4">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-base sm:text-lg mb-1">
                      No More Decision Fatigue
                    </h4>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      Overwhelmed by too many choices? We make finding food fun
                      and effortless.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 sm:gap-4">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-base sm:text-lg mb-1">
                      Personalized Just for You
                    </h4>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      Set your preferences for cuisine, price range, and dietary
                      needs. Get recommendations that match your taste.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 sm:gap-4">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-base sm:text-lg mb-1">
                      Discovery, Not Delivery
                    </h4>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      We focus on helping you discover great food spots, not
                      just ordering in. Explore local gems and hidden treasures.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-card rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-card">
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <div className="w-3 h-3 rounded-full bg-green-500 flex-shrink-0" />
                  <span className="font-semibold text-sm sm:text-base">Filter by Preferences</span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Budget-friendly, Spicy, Vegan, or Fine Dining — filter by what
                  matters to you
                </p>
              </div>
              <div className="bg-card rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-card">
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <div className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0" />
                  <span className="font-semibold text-sm sm:text-base">Interactive Map View</span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  See where restaurants are located and plan your food adventures
                </p>
              </div>
              <div className="bg-card rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-card">
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <div className="w-3 h-3 rounded-full bg-orange-500 flex-shrink-0" />
                  <span className="font-semibold text-sm sm:text-base">Real Reviews</span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Read authentic feedback from fellow food lovers in your community
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container max-w-6xl mx-auto px-4 py-12 sm:py-16 md:py-20">
        <div className="bg-gradient-primary rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 text-center shadow-elegant">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-foreground mb-3 sm:mb-4">
            Ready to Discover Your Next Favorite Spot?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-primary-foreground/90 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Join thousands of food lovers finding amazing restaurants with just a
            swipe
          </p>
          <Button
            onClick={handleGetStarted}
            size="lg"
            variant="secondary"
            className="text-sm sm:text-base md:text-lg px-6 sm:px-8"
          >
            Get Started Free
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card/80 backdrop-blur-sm border-t border-border py-8 sm:py-10 md:py-12">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-3">
              <img src={horizontalLogo} alt="Choose Eat" className="h-12 sm:h-14 md:h-16 w-auto" />
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground text-center md:text-left">
              © 2025 Choose Eat. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
