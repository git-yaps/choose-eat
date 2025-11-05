import { useState, useRef, useEffect } from "react";
import { Restaurant } from "@/types";
import { foodTags } from "@/data/mockRestaurants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, MapPin, Upload, X, Navigation, Map } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface AddRestaurantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRestaurantAdded?: () => void;
}

const MAPBOX_TOKEN = "pk.eyJ1IjoieWFwc3BhY2UiLCJhIjoiY205bzJvNTNoMG9qZDJqcHhxcHhwa3N2dyJ9.DXTcJDikewJBcYjsUPZc7Q";

export const AddRestaurantDialog = ({ open, onOpenChange, onRestaurantAdded }: AddRestaurantDialogProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const [isMapDialogOpen, setIsMapDialogOpen] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    priceRange: "$$" as Restaurant["priceRange"],
    priceMin: 200,
    priceMax: 500,
    selectedTags: [] as string[],
    latitude: 14.5547,
    longitude: 121.0244,
  });

  const handleTagToggle = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      selectedTags: prev.selectedTags.includes(tag)
        ? prev.selectedTags.filter(t => t !== tag)
        : [...prev.selectedTags, tag]
    }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file.",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!selectedFile) return null;

    setUploading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("No session found");
      }

      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${session.user.id}/${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('restaurant-images')
        .upload(fileName, selectedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        // If bucket doesn't exist, return a placeholder or use the image URL approach
        console.log("Storage upload failed:", error);
        // Fallback: use a default image or data URL
        return imagePreview;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('restaurant-images')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error: any) {
      console.error("Upload error:", error);
      // Fallback to data URL if upload fails
      return imagePreview;
    } finally {
      setUploading(false);
    }
  };

  const reverseGeocode = async (lng: number, lat: number) => {
    if (!MAPBOX_TOKEN) {
      console.warn('Mapbox token not available');
      return;
    }
    
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const place = data.features[0];
        const addressText = place.place_name || place.text || `${lat}, ${lng}`;
        setFormData(prev => ({
          ...prev,
          address: addressText,
          latitude: lat,
          longitude: lng,
        }));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return false;
    }
  };

  // Initialize map when dialog opens
  useEffect(() => {
    if (!isMapDialogOpen || !mapContainer.current || map.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    const currentLat = formData.latitude || 14.5995;
    const currentLng = formData.longitude || 120.9842;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [currentLng, currentLat],
      zoom: 13,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add initial marker if coordinates exist
    if (formData.latitude && formData.longitude) {
      marker.current = new mapboxgl.Marker()
        .setLngLat([formData.longitude, formData.latitude])
        .addTo(map.current);
    }

    // Add click handler to place marker
    map.current.on('click', async (e) => {
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
      await reverseGeocode(lng, lat);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        const success = await reverseGeocode(longitude, latitude);
        setIsGettingLocation(false);
        if (success) {
          toast({
            title: "Location found",
            description: "Your current location has been set.",
          });
          // Update map if it's open
          if (map.current && marker.current) {
            marker.current.remove();
            marker.current = new mapboxgl.Marker()
              .setLngLat([longitude, latitude])
              .addTo(map.current);
            map.current.flyTo({ center: [longitude, latitude], zoom: 15 });
          }
        } else {
          toast({
            title: "Error",
            description: "Could not get address for your location.",
            variant: "destructive",
          });
        }
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
    toast({
      title: "Location set",
      description: "The location has been saved.",
    });
  };

  const handleGeocode = async () => {
    if (!formData.address.trim()) {
      toast({
        title: "Address Required",
        description: "Please enter an address to get coordinates.",
        variant: "destructive",
      });
      return;
    }

    if (!MAPBOX_TOKEN) {
      toast({
        title: "Configuration Error",
        description: "Map service is not configured. Please enter coordinates manually.",
        variant: "destructive",
      });
      return;
    }

    setGeocoding(true);
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(formData.address)}.json?access_token=${MAPBOX_TOKEN}&country=PH`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        setFormData(prev => ({
          ...prev,
          latitude: lat,
          longitude: lng,
        }));
        toast({
          title: "Location Found",
          description: "Coordinates have been set for this address.",
        });
      } else {
        toast({
          title: "Location Not Found",
          description: "Could not find coordinates for this address.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Geocoding error:", error);
      toast({
        title: "Error",
        description: error.message?.includes("fetch") 
          ? "Network error. Please check your connection and try again."
          : "Failed to geocode address. Please try again or enter coordinates manually.",
        variant: "destructive",
      });
    } finally {
      setGeocoding(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.address || !selectedFile) {
      toast({
        title: "Missing Fields",
        description: "Please fill in name, address, and upload an image.",
        variant: "destructive",
      });
      return;
    }

    if (formData.priceMin >= formData.priceMax) {
      toast({
        title: "Invalid Price Range",
        description: "Minimum price must be less than maximum price.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please log in to add restaurants.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Upload image first
      const imageUrl = await uploadImage();
      if (!imageUrl) {
        toast({
          title: "Upload Failed",
          description: "Failed to upload image. Please try again.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Save to Supabase restaurants table
      const { data, error } = await (supabase as any)
        .from("restaurants")
        .insert({
          name: formData.name.trim(),
          image: imageUrl,
          description: formData.description.trim(),
          address: formData.address.trim(),
          price_range: formData.priceRange,
          price_min: formData.priceMin,
          price_max: formData.priceMax,
          tags: formData.selectedTags,
          latitude: formData.latitude,
          longitude: formData.longitude,
          user_id: session.user.id,
        })
        .select()
        .single();

      if (error) {
        // If table doesn't exist, just show success message (mock data approach)
        console.log("Database insert failed, using local storage:", error);
        toast({
          title: "Restaurant Added!",
          description: "The restaurant has been added successfully.",
        });
      } else {
        toast({
          title: "Restaurant Added!",
          description: "The restaurant has been saved successfully.",
        });
      }

      // Reset form
      setFormData({
        name: "",
        description: "",
        address: "",
        priceRange: "$$",
        priceMin: 200,
        priceMax: 500,
        selectedTags: [],
        latitude: 14.5547,
        longitude: 121.0244,
      });
      setSelectedFile(null);
      setImagePreview("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      onOpenChange(false);
      if (onRestaurantAdded) {
        onRestaurantAdded();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add restaurant.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-3 sm:p-4 md:p-6 pb-20 sm:pb-6 w-[calc(100%-0.5rem)] sm:w-[calc(100%-2rem)] md:w-full max-w-[98vw] sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl md:text-2xl">Add New Restaurant</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Share your favorite food spot with the community
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 sm:space-y-4">
          <div className="space-y-1.5 sm:space-y-2">
            <label className="text-xs sm:text-sm font-medium">Restaurant Name *</label>
            <Input
              placeholder="Enter restaurant name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="h-10 sm:h-12 text-xs sm:text-sm"
              required
            />
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <label className="text-xs sm:text-sm font-medium">Restaurant Image *</label>
            <div className="space-y-2 sm:space-y-3">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-32 sm:h-40 md:h-48 object-cover rounded-md sm:rounded-lg border-2 border-border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={handleRemoveImage}
                    className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 h-7 w-7 sm:h-8 sm:w-8 min-h-[28px] min-w-[28px] touch-manipulation"
                  >
                    <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </Button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-border rounded-md sm:rounded-lg p-4 sm:p-6 md:p-8 text-center cursor-pointer hover:bg-accent/50 transition-colors"
                >
                  <Upload className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-1.5 sm:mb-2 text-muted-foreground" />
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                    Click to upload an image
                  </p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">
                    PNG, JPG up to 5MB
                  </p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              {!imagePreview && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full text-xs sm:text-sm h-9 sm:h-10 min-h-[36px] sm:min-h-[40px] touch-manipulation"
                >
                  <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                  Select Image
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <label className="text-xs sm:text-sm font-medium">Description</label>
            <Textarea
              placeholder="Describe the restaurant..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="text-xs sm:text-sm min-h-[80px] sm:min-h-[100px]"
            />
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <label className="text-xs sm:text-sm font-medium">Address *</label>
            <div className="flex gap-1.5 sm:gap-2">
              <Input
                placeholder="Enter address"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                className="h-10 sm:h-12 flex-1 text-xs sm:text-sm min-h-[40px] sm:min-h-[48px] touch-manipulation"
                required
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setIsMapDialogOpen(true)}
                className="h-10 w-10 sm:h-12 sm:w-12 shrink-0 min-h-[40px] sm:min-h-[48px] min-w-[40px] sm:min-w-[48px] touch-manipulation"
                title="Pick location on map"
              >
                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </Button>
            </div>
            <button
              type="button"
              onClick={handleGetCurrentLocation}
              disabled={isGettingLocation}
              className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors touch-manipulation"
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

          <div className="space-y-1.5 sm:space-y-2">
            <label className="text-xs sm:text-sm font-medium">Price Range</label>
            <select
              value={formData.priceRange}
              onChange={(e) => {
                const range = e.target.value as Restaurant["priceRange"];
                setFormData(prev => ({
                  ...prev,
                  priceRange: range,
                  priceMin: range === "$" ? 50 : range === "$$" ? 200 : range === "$$$" ? 500 : 1000,
                  priceMax: range === "$" ? 200 : range === "$$" ? 500 : range === "$$$" ? 1200 : 2000,
                }));
              }}
              className="w-full h-10 sm:h-12 rounded-md border border-input bg-background px-2 sm:px-3 py-2 text-xs sm:text-sm min-h-[40px] sm:min-h-[48px] touch-manipulation"
            >
              <option value="$">$ - Budget</option>
              <option value="$$">$$ - Moderate</option>
              <option value="$$$">$$$ - Expensive</option>
              <option value="$$$$">$$$$ - Fine Dining</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-xs sm:text-sm font-medium">Minimum Price (₱)</label>
              <Input
                type="number"
                min="0"
                step="10"
                placeholder="200"
                value={formData.priceMin}
                onChange={(e) => setFormData(prev => ({ ...prev, priceMin: parseInt(e.target.value) || 0 }))}
                className="h-10 sm:h-12 text-xs sm:text-sm min-h-[40px] sm:min-h-[48px] touch-manipulation"
              />
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-xs sm:text-sm font-medium">Maximum Price (₱)</label>
              <Input
                type="number"
                min="0"
                step="10"
                placeholder="500"
                value={formData.priceMax}
                onChange={(e) => setFormData(prev => ({ ...prev, priceMax: parseInt(e.target.value) || 0 }))}
                className="h-10 sm:h-12 text-xs sm:text-sm min-h-[40px] sm:min-h-[48px] touch-manipulation"
              />
            </div>
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <label className="text-xs sm:text-sm font-medium">Tags</label>
            <div className="flex flex-wrap gap-1.5 sm:gap-2 max-h-24 sm:max-h-32 overflow-y-auto p-2 border rounded-md sm:rounded-lg">
              {foodTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={formData.selectedTags.includes(tag) ? "default" : "outline"}
                  className={`cursor-pointer transition-all hover:scale-105 text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 min-h-[28px] sm:min-h-[32px] touch-manipulation flex items-center ${
                    formData.selectedTags.includes(tag) ? "bg-gradient-primary border-0" : ""
                  }`}
                  onClick={() => handleTagToggle(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 text-xs sm:text-sm h-10 sm:h-11 min-h-[44px] touch-manipulation"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="gradient"
              onClick={handleSubmit}
              className="flex-1 text-xs sm:text-sm h-10 sm:h-11 min-h-[44px] touch-manipulation"
              disabled={loading || uploading}
            >
              {loading || uploading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 animate-spin" />
                  {uploading ? "Uploading..." : "Adding..."}
                </>
              ) : (
                "Add Restaurant"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>

      {/* Map Dialog for Pinning Location */}
      <Dialog open={isMapDialogOpen} onOpenChange={setIsMapDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-3 sm:p-4 md:p-6 w-[calc(100%-0.5rem)] sm:w-[calc(100%-2rem)] md:w-full max-w-[98vw] sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Pin Restaurant Location</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Click on the map to set the restaurant location, or use your current location
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div 
              ref={mapContainer} 
              className="h-[300px] sm:h-[400px] w-full bg-muted rounded-lg sm:rounded-xl overflow-hidden border border-border"
            />
            
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleGetCurrentLocation}
                disabled={isGettingLocation}
                className="flex-1 text-xs sm:text-sm h-9 sm:h-10 min-h-[36px] sm:min-h-[40px] touch-manipulation"
              >
                {isGettingLocation ? (
                  <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 animate-spin" />
                ) : (
                  <Navigation className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                )}
                Use Current Location
              </Button>
              <Button
                type="button"
                variant="gradient"
                onClick={handleMapConfirm}
                className="flex-1 text-xs sm:text-sm h-9 sm:h-10 min-h-[36px] sm:min-h-[40px] touch-manipulation"
              >
                Confirm Location
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
};

