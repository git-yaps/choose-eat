import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo.png";
import poster from "@/assets/poster.png";
import { Loader2, MapPin, Navigation, Eye, EyeOff, Camera } from "lucide-react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const AVATAR_OPTIONS = [
  "😊", "😎", "🤩", "🥳", "😄", "😃", "😁", "🤗",
  "🤓", "🧐", "😇", "🤠", "🥰", "😍", "😋", "🤤",
  "😏", "😌", "😊", "🙂", "😉", "😗", "😙", "😚",
  "🤔", "🤨", "🧑", "👨", "👩", "👴", "👵", "👶",
  "🧑‍🍳", "👨‍🍳", "👩‍🍳", "🧑‍💼", "👨‍💼", "👩‍💼", "🧑‍🎨", "👨‍🎨"
];

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [signupStep, setSignupStep] = useState<"email" | "details" | "avatar">("email");
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [cityOrZipCode, setCityOrZipCode] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isMapDialogOpen, setIsMapDialogOpen] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [avatar, setAvatar] = useState<string>("😊");
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const MAPBOX_TOKEN = "pk.eyJ1IjoieWFwc3BhY2UiLCJhIjoiY205bzJvNTNoMG9qZDJqcHhxcHhwa3N2dyJ9.DXTcJDikewJBcYjsUPZc7Q";

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // Always redirect to app on login (don't check preferences)
        navigate("/app");
      }
      // If no session, stay on auth page (show login/signup form)
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Only handle SIGNED_IN event, not existing sessions
      if (session && event === "SIGNED_IN") {
        // On login, always go to app (discover page)
        navigate("/app");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const reverseGeocode = async (lng: number, lat: number) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}`
      );
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const place = data.features[0];
        // Try to get city, zip code, or locality
        const city = place.context?.find((c: any) => 
          c.id.startsWith('place') || c.id.startsWith('postcode')
        );
        const locationText = city?.text || place.place_name || `${lat}, ${lng}`;
        setCityOrZipCode(locationText);
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error);
    }
  };

  // Initialize map when dialog opens
  useEffect(() => {
    if (!isMapDialogOpen || !mapContainer.current || map.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [120.9842, 14.5995], // Default to Philippines center
      zoom: 10,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add click handler to place marker
    map.current.on('click', (e) => {
      const { lng, lat } = e.lngLat;
      
      // Remove existing marker
      if (marker.current) {
        marker.current.remove();
      }

      // Add new marker
      marker.current = new mapboxgl.Marker()
        .setLngLat([lng, lat])
        .addTo(map.current!);

      // Reverse geocode to get address
      reverseGeocode(lng, lat);
    });

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
      if (marker.current) {
        marker.current.remove();
        marker.current = null;
      }
    };
  }, [isMapDialogOpen]);

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation.",
        variant: "destructive",
      });
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        await reverseGeocode(longitude, latitude);
        setIsGettingLocation(false);
        toast({
          title: "Location found",
          description: "Your location has been set.",
        });
      },
      (error) => {
        setIsGettingLocation(false);
        toast({
          title: "Location error",
          description: "Unable to get your location. Please enable location permissions.",
          variant: "destructive",
        });
      }
    );
  };

  const handleMapConfirm = () => {
    if (marker.current) {
      const lngLat = marker.current.getLngLat();
      reverseGeocode(lngLat.lng, lngLat.lat);
    }
    setIsMapDialogOpen(false);
  };

  const handleEmailPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      // Handle login
      setLoading(true);
      try {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) throw error;

        toast({
          title: "Welcome back!",
          description: "You've successfully logged in.",
        });

        navigate("/app");
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "An error occurred. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    } else {
      // Move to next step for signup
      if (!email.trim() || !password) {
        toast({
          title: "Missing Information",
          description: "Please fill in email and password.",
          variant: "destructive",
        });
        return;
      }
      setSignupStep("details");
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate inputs
    if (!name.trim() || !cityOrZipCode.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    // Move to avatar step
    setSignupStep("avatar");
  };

  const handleAvatarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/app`,
          data: {
            name: name.trim(),
            city_or_zip_code: cityOrZipCode.trim(),
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        // Create profile with basic info
        const { error: profileError } = await (supabase as any)
          .from("profiles")
          .insert({
            user_id: data.user.id,
            name: name.trim(),
            city_or_zip_code: cityOrZipCode.trim(),
            avatar: avatar,
          });

        if (profileError) {
          console.error("Profile creation error:", profileError);
        }

        toast({
          title: "Account created!",
          description: "Welcome to Choose Eat. Let's set up your preferences.",
        });

        // Redirect to preferences setup
        navigate("/preferences");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-warm flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-6xl mx-auto grid md:grid-cols-2 gap-6 md:gap-8 items-center animate-scale-in">
        {/* Poster on the left */}
        <div className="hidden md:flex items-center justify-center">
          <img 
            src={poster} 
            alt="Choose Eat" 
            className="w-full h-auto max-h-[600px] object-contain rounded-2xl"
          />
        </div>

        {/* Form on the right */}
        <div className="w-full">
          <div className="bg-card rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 shadow-card space-y-4 sm:space-y-5 md:space-y-6">
            <div className="text-center space-y-2">
              <img src={logo} alt="Choose Eat" className="h-16 sm:h-20 md:h-24 w-auto mx-auto" />
              <h1 className="text-2xl sm:text-2xl md:text-3xl font-bold">
                {isLogin 
                  ? "Welcome Back" 
                  : signupStep === "email" 
                    ? "Join Choose Eat" 
                    : signupStep === "details"
                      ? "Tell Us About Yourself"
                      : "Choose Your Avatar"}
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                {isLogin
                  ? "Sign in to continue discovering great food"
                  : signupStep === "email"
                    ? "Create an account to start your food journey"
                    : signupStep === "details"
                      ? "Help us personalize your experience"
                      : "Select an avatar for your profile"}
              </p>
            </div>

            {isLogin || signupStep === "email" ? (
              <form onSubmit={handleEmailPasswordSubmit} className="space-y-3 sm:space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 sm:h-12 text-sm sm:text-base"
                    required
                    maxLength={255}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Password</label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-11 sm:h-12 text-sm sm:text-base pr-10 sm:pr-12"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                      ) : (
                        <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="gradient"
                  size="lg"
                  className="w-full text-sm sm:text-base"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {isLogin ? "Signing in..." : "Continue"}
                    </>
                  ) : (
                    <>{isLogin ? "Sign In" : "Continue"}</>
                  )}
                </Button>
              </form>
            ) : signupStep === "details" ? (
              <form onSubmit={handleSignupSubmit} className="space-y-3 sm:space-y-4">
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
                  <label className="text-sm font-medium">Your Location</label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Enter your city or zip code"
                      value={cityOrZipCode}
                      onChange={(e) => setCityOrZipCode(e.target.value)}
                      className="h-11 sm:h-12 text-sm sm:text-base"
                      required
                      maxLength={100}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-11 w-11 sm:h-12 sm:w-12 shrink-0"
                      onClick={() => setIsMapDialogOpen(true)}
                      title="Pick location on map"
                    >
                      <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                  </div>
                  <button
                    type="button"
                    onClick={handleGetCurrentLocation}
                    disabled={isGettingLocation}
                    className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {isGettingLocation ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
                        Getting location...
                      </>
                    ) : (
                      <>
                        <Navigation className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        Get Current Location
                      </>
                    )}
                  </button>
                </div>

                <Button
                  type="submit"
                  variant="gradient"
                  size="lg"
                  className="w-full text-sm sm:text-base"
                  disabled={loading}
                >
                  Continue
                </Button>
              </form>
            ) : (
              <form onSubmit={handleAvatarSubmit} className="space-y-2 sm:space-y-3">
                <div className="flex flex-col items-center justify-center py-2 sm:py-3 md:py-4">
                  <Avatar className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 mb-2 sm:mb-3">
                    <AvatarFallback className="text-3xl sm:text-4xl md:text-5xl bg-gradient-primary">
                      {avatar}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsAvatarDialogOpen(true)}
                    className="flex items-center gap-2 text-xs sm:text-sm"
                  >
                    <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    Change Avatar
                  </Button>
                </div>

                <Button
                  type="submit"
                  variant="gradient"
                  size="lg"
                  className="w-full text-sm sm:text-base"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            )}

          {isLogin ? (
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(false);
                  setSignupStep("email");
                }}
                className="text-sm text-primary hover:underline"
              >
                Don't have an account? Sign up
              </button>
            </div>
          ) : signupStep === "email" ? (
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(true);
                  setSignupStep("email");
                }}
                className="text-sm text-primary hover:underline"
              >
                Already have an account? Sign in
              </button>
            </div>
          ) : (
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setSignupStep("email")}
                className="text-sm text-primary hover:underline"
              >
                ← Back
              </button>
            </div>
          )}
          </div>
        </div>
      </div>

          {/* Map Location Picker Dialog */}
          <Dialog open={isMapDialogOpen} onOpenChange={setIsMapDialogOpen}>
            <DialogContent className="max-w-4xl w-[95vw] h-[85vh] sm:h-[600px] p-0">
              <DialogHeader className="p-4 sm:p-6 pb-0">
                <DialogTitle className="text-lg sm:text-xl">Pick Your Location</DialogTitle>
                <DialogDescription className="text-xs sm:text-sm">
                  Click on the map to set your location
                </DialogDescription>
              </DialogHeader>
              <div className="flex-1 p-4 sm:p-6 pt-4">
                <div ref={mapContainer} className="w-full h-[400px] sm:h-[500px] rounded-lg" />
                <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsMapDialogOpen(false)}
                    className="w-full sm:w-auto text-sm"
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleMapConfirm} className="w-full sm:w-auto text-sm">
                    Confirm Location
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Avatar Picker Dialog */}
          <Dialog open={isAvatarDialogOpen} onOpenChange={setIsAvatarDialogOpen}>
            <DialogContent className="max-w-[95vw] sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-lg sm:text-xl">Choose Your Avatar</DialogTitle>
                <DialogDescription className="text-xs sm:text-sm">
                  Select an avatar for your profile picture
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-6 sm:grid-cols-6 gap-3 sm:gap-4 max-h-[50vh] sm:max-h-[400px] overflow-y-auto">
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

export default Auth;
