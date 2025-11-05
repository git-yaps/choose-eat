import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, Target, Zap, MapPin, Star, Bookmark, Brain, Smartphone, Heart, Users, TrendingUp, Printer } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";
import horizontalLogo from "@/assets/horizontal-logo.png";

const Documentation = () => {
  const navigate = useNavigate();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-warm">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-40 shadow-sm print:hidden">
        <div className="container max-w-4xl mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/")}
                className="flex-shrink-0"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
              <img src={logo} alt="Choose Eat" className="h-8 sm:h-10 md:h-12 w-auto" />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handlePrint}
                size="sm"
                className="text-xs sm:text-sm flex items-center gap-2"
              >
                <Printer className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Print</span>
              </Button>
              <Button
                variant="gradient"
                onClick={() => navigate("/auth")}
                size="sm"
                className="text-xs sm:text-sm"
              >
                Start Swiping
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Documentation Content */}
      <main className="container max-w-5xl mx-auto px-4 py-8 sm:py-12">
        {/* Hero Section */}
        <div className="text-center space-y-6 mb-12 sm:mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <img src={horizontalLogo} alt="Choose Eat" className="h-16 sm:h-20 md:h-24 w-auto" />
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-semibold text-sm sm:text-base mb-4">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Application Documentation for Emerging Technologies</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
            🧡 Choose Eat
            <br />
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Find your next bite!
            </span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            A modern food discovery app that transforms decision-making into an engaging, swipe-based experience
          </p>
        </div>

        <div className="bg-card rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10 shadow-card space-y-8 sm:space-y-10">

          {/* Section 1: Introduction */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-primary flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-primary-foreground" />
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">1. Introduction</h2>
            </div>
            <div className="space-y-4 text-sm sm:text-base md:text-lg leading-relaxed text-muted-foreground">
              <p className="text-base sm:text-lg md:text-xl">
                Choose Eat is a modern food discovery app that helps users decide where to eat through a swipe-based interface inspired by dating apps. Users can swipe right for food they like and left for those they don't. The app learns user preferences to personalize future suggestions, making food discovery fast, fun, and intuitive.
              </p>
              <p className="font-semibold text-foreground">
                As an emerging technology project, Choose Eat integrates several innovative elements:
              </p>
               <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mt-6">
                 <div className="bg-card rounded-xl p-4 sm:p-5 shadow-card space-y-2 sm:space-y-3 hover:shadow-elegant transition-shadow">
                   <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-primary flex items-center justify-center">
                     <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
                   </div>
                   <h4 className="text-lg sm:text-xl font-bold">Artificial Intelligence (AI)</h4>
                   <p className="text-xs sm:text-sm text-muted-foreground">For personalization and recommendations</p>
                 </div>
                 <div className="bg-card rounded-xl p-4 sm:p-5 shadow-card space-y-2 sm:space-y-3 hover:shadow-elegant transition-shadow">
                   <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-primary flex items-center justify-center">
                     <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
                   </div>
                   <h4 className="text-lg sm:text-xl font-bold">Location-based Services (Mapbox)</h4>
                   <p className="text-xs sm:text-sm text-muted-foreground">For finding nearby food spots</p>
                 </div>
                 <div className="bg-card rounded-xl p-4 sm:p-5 shadow-card space-y-2 sm:space-y-3 hover:shadow-elegant transition-shadow">
                   <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-primary flex items-center justify-center">
                     <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
                   </div>
                   <h4 className="text-lg sm:text-xl font-bold">Gamified UX</h4>
                   <p className="text-xs sm:text-sm text-muted-foreground">Inspired by swipe-based apps to make decision-making interactive</p>
                 </div>
                 <div className="bg-card rounded-xl p-4 sm:p-5 shadow-card space-y-2 sm:space-y-3 hover:shadow-elegant transition-shadow">
                   <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-primary flex items-center justify-center">
                     <Smartphone className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
                   </div>
                   <h4 className="text-lg sm:text-xl font-bold">Low-code Development (Lovable AI)</h4>
                   <p className="text-xs sm:text-sm text-muted-foreground">Demonstrates the potential of AI-assisted app creation</p>
                 </div>
               </div>
            </div>
          </section>

          {/* Section 2: Objectives */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-primary flex items-center justify-center flex-shrink-0">
                <Target className="w-6 h-6 sm:w-7 sm:h-7 text-primary-foreground" />
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">2. Objectives</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-5 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white font-bold text-sm">1</span>
                </div>
                <p className="text-sm sm:text-base leading-relaxed text-foreground">
                  Simplify food decision-making with personalization.
                </p>
              </div>
              <div className="flex items-start gap-3 p-5 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white font-bold text-sm">2</span>
                </div>
                <p className="text-sm sm:text-base leading-relaxed text-foreground">
                  Use AI and location-based technology for relevant, context-aware recommendations.
                </p>
              </div>
              <div className="flex items-start gap-3 p-5 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white font-bold text-sm">3</span>
                </div>
                <p className="text-sm sm:text-base leading-relaxed text-foreground">
                  Promote local food businesses by improving visibility in app-based searches.
                </p>
              </div>
              <div className="flex items-start gap-3 p-5 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white font-bold text-sm">4</span>
                </div>
                <p className="text-sm sm:text-base leading-relaxed text-foreground">
                  Apply emerging technologies to solve real-world daily challenges.
                </p>
              </div>
              <div className="flex items-start gap-3 p-5 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 sm:col-span-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white font-bold text-sm">5</span>
                </div>
                <p className="text-sm sm:text-base leading-relaxed text-foreground">
                  Encourage user engagement through gamified swiping, bookmarking, and reviewing experiences.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Key Features */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-primary flex items-center justify-center flex-shrink-0">
                <Zap className="w-6 h-6 sm:w-7 sm:h-7 text-primary-foreground" />
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">3. Key Features and Functionalities</h2>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-6">
              {/* 3.1 */}
              <div className="rounded-xl bg-card border-2 border-border hover:border-primary/50 transition-all hover:shadow-lg overflow-hidden">
                <div className="w-full h-48 sm:h-56 bg-muted flex items-center justify-center">
                  {/* Mockup placeholder - replace with actual image */}
                  <div className="text-center p-4">
                    <Users className="w-12 h-12 text-muted-foreground/50 mx-auto mb-2" />
                    <p className="text-xs sm:text-sm text-muted-foreground">Mockup Image</p>
                  </div>
                </div>
                <div className="p-5 sm:p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-foreground">3.1 Onboarding and Food Preferences</h3>
                  </div>
                  <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
                    Users select their location, budget, and food preferences (such as cuisine type, taste profile, and dining mood) during onboarding to personalize their experience.
                  </p>
                </div>
              </div>

              {/* 3.2 */}
              <div className="rounded-xl bg-card border-2 border-border hover:border-primary/50 transition-all hover:shadow-lg overflow-hidden">
                <div className="w-full h-48 sm:h-56 bg-muted flex items-center justify-center">
                  {/* Mockup placeholder - replace with actual image */}
                  <div className="text-center p-4">
                    <Heart className="w-12 h-12 text-muted-foreground/50 mx-auto mb-2" />
                    <p className="text-xs sm:text-sm text-muted-foreground">Mockup Image</p>
                  </div>
                </div>
                <div className="p-5 sm:p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Heart className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-foreground">3.2 Swipe-Based Food Discovery</h3>
                  </div>
                  <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
                    Users swipe right for meals or restaurants they like and left for those they don't. This trains the algorithm to refine recommendations over time.
                  </p>
                </div>
              </div>

              {/* 3.3 */}
              <div className="rounded-xl bg-card border-2 border-border hover:border-primary/50 transition-all hover:shadow-lg overflow-hidden">
                <div className="w-full h-48 sm:h-56 bg-muted flex items-center justify-center">
                  {/* Mockup placeholder - replace with actual image */}
                  <div className="text-center p-4">
                    <MapPin className="w-12 h-12 text-muted-foreground/50 mx-auto mb-2" />
                    <p className="text-xs sm:text-sm text-muted-foreground">Mockup Image</p>
                  </div>
                </div>
                <div className="p-5 sm:p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-foreground">3.3 Interactive Map View</h3>
                  </div>
                  <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
                    Choose Eat integrates Mapbox to let users explore nearby food spots, view restaurant details, and get directions easily.
                  </p>
                </div>
              </div>

              {/* 3.4 */}
              <div className="rounded-xl bg-card border-2 border-border hover:border-primary/50 transition-all hover:shadow-lg overflow-hidden">
                <div className="w-full h-48 sm:h-56 bg-muted flex items-center justify-center">
                  {/* Mockup placeholder - replace with actual image */}
                  <div className="text-center p-4">
                    <Star className="w-12 h-12 text-muted-foreground/50 mx-auto mb-2" />
                    <p className="text-xs sm:text-sm text-muted-foreground">Mockup Image</p>
                  </div>
                </div>
                <div className="p-5 sm:p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Star className="w-5 h-5 text-primary fill-primary" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-foreground">3.4 Ratings and Reviews</h3>
                  </div>
                  <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
                    Users can leave short reviews and star ratings to share their experiences and help others discover quality food spots.
                  </p>
                </div>
              </div>

              {/* 3.5 */}
              <div className="rounded-xl bg-card border-2 border-border hover:border-primary/50 transition-all hover:shadow-lg overflow-hidden">
                <div className="w-full h-48 sm:h-56 bg-muted flex items-center justify-center">
                  {/* Mockup placeholder - replace with actual image */}
                  <div className="text-center p-4">
                    <Bookmark className="w-12 h-12 text-muted-foreground/50 mx-auto mb-2" />
                    <p className="text-xs sm:text-sm text-muted-foreground">Mockup Image</p>
                  </div>
                </div>
                <div className="p-5 sm:p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Bookmark className="w-5 h-5 text-primary fill-primary" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-foreground">3.5 Bookmarks and Favorites</h3>
                  </div>
                  <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
                    Users can bookmark favorite restaurants or dishes for quick access later.
                  </p>
                </div>
              </div>

              {/* 3.6 */}
              <div className="rounded-xl bg-card border-2 border-border hover:border-primary/50 transition-all hover:shadow-lg overflow-hidden">
                <div className="w-full h-48 sm:h-56 bg-muted flex items-center justify-center">
                  {/* Mockup placeholder - replace with actual image */}
                  <div className="text-center p-4">
                    <TrendingUp className="w-12 h-12 text-muted-foreground/50 mx-auto mb-2" />
                    <p className="text-xs sm:text-sm text-muted-foreground">Mockup Image</p>
                  </div>
                </div>
                <div className="p-5 sm:p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-foreground">3.6 Personalized Recommendations</h3>
                  </div>
                  <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
                    The app learns from each user's activity to provide smarter and more relevant suggestions.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <div className="pt-6 border-t border-border mt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <img src={horizontalLogo} alt="Choose Eat" className="h-10 sm:h-12 w-auto opacity-60" />
              <p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-right">
                © 2025 Choose Eat. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Documentation;

