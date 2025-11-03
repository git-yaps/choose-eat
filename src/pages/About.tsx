import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import heroFood from "@/assets/hero-food.jpg";
import logo from "@/assets/logo.png";
import { Heart, MapPin, Sparkles, Users } from "lucide-react";

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-warm">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background/40 z-10" />
        <img
          src={heroFood}
          alt="Delicious food spread"
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        <div className="relative z-20 container mx-auto px-4 py-20 md:py-32">
          <div className="text-center max-w-3xl mx-auto animate-scale-in">
            <img src={logo} alt="Choose Eat" className="h-24 w-auto mx-auto mb-8" />
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Discover Your Next <br />
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Favorite Restaurant
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              Swipe through curated restaurant recommendations tailored to your taste
            </p>
            <Button
              variant="gradient"
              size="lg"
              onClick={() => navigate("/auth")}
              className="text-lg px-8 py-6"
            >
              Get Started
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card/50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">
            How It Works
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center animate-fade-in">
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Personalized Feed</h3>
              <p className="text-muted-foreground">
                Get restaurant recommendations based on your unique taste profile
              </p>
            </div>

            <div className="text-center animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Swipe to Decide</h3>
              <p className="text-muted-foreground">
                Swipe right to save, left to skip. It's that simple
              </p>
            </div>

            <div className="text-center animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Explore Local</h3>
              <p className="text-muted-foreground">
                Discover hidden gems and popular spots in your area
              </p>
            </div>

            <div className="text-center animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Community Driven</h3>
              <p className="text-muted-foreground">
                Real reviews from real food lovers just like you
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Find Your Next Meal?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of food lovers discovering amazing restaurants every day
          </p>
          <Button
            variant="gradient"
            size="lg"
            onClick={() => navigate("/auth")}
            className="text-lg px-8 py-6"
          >
            Start Swiping
          </Button>
        </div>
      </section>
    </div>
  );
};

export default About;
