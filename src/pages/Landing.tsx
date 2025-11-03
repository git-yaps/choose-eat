import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FoodPreferences } from "@/components/FoodPreferences";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";

const Landing = () => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [showPreferences, setShowPreferences] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cityOrZip, setCityOrZip] = useState("");

  // Check if user is already logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/app");
      }
    });
  }, [navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/app`,
        },
      });

      if (error) throw error;

      if (data.user) {
        setUserId(data.user.id);
        setShowPreferences(true);
        toast({
          title: "Account created!",
          description: "Now let's set up your food preferences.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Welcome back!",
        description: "Redirecting to your feed...",
      });
      navigate("/app");
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePreferencesComplete = async (preferences: {
    tasteProfile: string[];
    dietaryPreferences: string[];
    budgetMin: number;
    budgetMax: number;
    mealCategories: string[];
    diningOccasions: string[];
  }) => {
    if (!userId) return;

    try {
      const { error } = await supabase.from("profiles").insert({
        user_id: userId,
        name,
        city_or_zip_code: cityOrZip,
        taste_profile: preferences.tasteProfile,
        dietary_preferences: preferences.dietaryPreferences,
        budget_min: preferences.budgetMin,
        budget_max: preferences.budgetMax,
        meal_categories: preferences.mealCategories,
        dining_occasions: preferences.diningOccasions,
      });

      if (error) throw error;

      toast({
        title: "Profile created!",
        description: "Let's start discovering great food.",
      });
      navigate("/app");
    } catch (error: any) {
      toast({
        title: "Error saving preferences",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (showPreferences) {
    return (
      <div className="min-h-screen bg-gradient-warm flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <img src={logo} alt="Choose Eat" className="h-20 w-auto mx-auto mb-4" />
          </div>
          <FoodPreferences onComplete={handlePreferencesComplete} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-warm flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 animate-scale-in">
        <div className="text-center">
          <img src={logo} alt="Choose Eat" className="h-24 w-auto mx-auto mb-6" />
          <h1 className="text-4xl font-bold mb-2">
            Welcome to <span className="bg-gradient-primary bg-clip-text text-transparent">Choose Eat</span>
          </h1>
          <p className="text-muted-foreground">
            Discover amazing restaurants with just a swipe
          </p>
        </div>

        <Tabs
          value={isSignUp ? "signup" : "login"}
          onValueChange={(value) => setIsSignUp(value === "signup")}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
            <TabsTrigger value="login">Login</TabsTrigger>
          </TabsList>

          <TabsContent value="signup">
            <form onSubmit={handleSignUp} className="bg-card rounded-2xl p-8 shadow-card space-y-6">
              <div className="space-y-2">
                <Label htmlFor="signup-name">Name</Label>
                <Input
                  id="signup-name"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-city">City or Zip Code</Label>
                <Input
                  id="signup-city"
                  placeholder="e.g., Manila or 1000"
                  value={cityOrZip}
                  onChange={(e) => setCityOrZip(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                variant="gradient"
                size="lg"
                className="w-full"
                disabled={loading}
              >
                {loading ? "Creating account..." : "Create Account"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="bg-card rounded-2xl p-8 shadow-card space-y-6">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                variant="gradient"
                size="lg"
                className="w-full"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Landing;
