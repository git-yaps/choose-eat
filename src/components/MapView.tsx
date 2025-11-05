import { Restaurant } from "@/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RestaurantCard } from "@/components/RestaurantCard";
import { ReviewsDialog } from "@/components/ReviewsDialog";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface MapViewProps {
  restaurants: Restaurant[];
  userLocation: string;
}

export const MapView = ({ restaurants, userLocation }: MapViewProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [location, setLocation] = useState(userLocation);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [showReviews, setShowReviews] = useState(false);
  const MAPBOX_TOKEN = "pk.eyJ1IjoieWFwc3BhY2UiLCJhIjoiY205bzJvNTNoMG9qZDJqcHhxcHhwa3N2dyJ9.DXTcJDikewJBcYjsUPZc7Q";

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    // Calculate center point from restaurants
    const avgLat = restaurants.reduce((sum, r) => sum + r.latitude, 0) / restaurants.length;
    const avgLng = restaurants.reduce((sum, r) => sum + r.longitude, 0) / restaurants.length;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [avgLng, avgLat],
      zoom: 13,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Ensure map fits its container
    map.current.on('load', () => {
      map.current?.resize();
    });
    // Extra safety resize shortly after init
    setTimeout(() => map.current?.resize(), 100);

    const handleResize = () => map.current?.resize();
    window.addEventListener('resize', handleResize);

    // Add markers for each restaurant
    restaurants.forEach((restaurant) => {
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.width = '32px';
      el.style.height = '32px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = '#C2410C';
      el.style.border = '3px solid white';
      el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
      el.style.cursor = 'pointer';
      el.style.transition = 'transform 0.2s';
      
      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.2)';
      });
      
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1)';
      });

      // Detect screen size for responsive popup
      const isSmallScreen = window.innerWidth <= 640;
      const popupMaxWidth = isSmallScreen ? '180px' : '250px';
      const popupOffset = isSmallScreen ? 15 : 25;

      const popup = new mapboxgl.Popup({ 
        offset: popupOffset, 
        maxWidth: popupMaxWidth,
        closeButton: true,
        closeOnClick: false,
        className: 'restaurant-popup'
      }).setHTML(
        `<div class="popup-content" style="padding: ${isSmallScreen ? '8px 10px' : '12px 14px'}; font-family: 'DM Sans', sans-serif; background: white; border-radius: ${isSmallScreen ? '6px' : '8px'}; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
          <h3 style="font-weight: 700; margin-bottom: ${isSmallScreen ? '4px' : '6px'}; font-size: ${isSmallScreen ? '13px' : '15px'}; line-height: 1.3; color: #1a1a1a; word-wrap: break-word;">${restaurant.name}</h3>
          <p style="color: #666; font-size: ${isSmallScreen ? '11px' : '13px'}; margin-bottom: ${isSmallScreen ? '4px' : '6px'}; line-height: 1.4;">${restaurant.cuisine}</p>
          <p style="font-size: ${isSmallScreen ? '10px' : '12px'}; margin-bottom: ${isSmallScreen ? '3px' : '5px'}; color: #333; line-height: 1.4;">⭐ ${restaurant.rating} • ${restaurant.priceRange} • ${restaurant.distance} mi</p>
          <p style="color: #C2410C; font-weight: 600; font-size: ${isSmallScreen ? '11px' : '13px'}; margin: 0; line-height: 1.4;">₱${restaurant.priceMin} - ₱${restaurant.priceMax}</p>
        </div>`
      );

      new mapboxgl.Marker(el)
        .setLngLat([restaurant.longitude, restaurant.latitude])
        .setPopup(popup)
        .addTo(map.current!);
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      map.current?.remove();
      map.current = null;
    };
  }, [restaurants]);

  const handleGetDirections = (restaurant: Restaurant) => {
    const query = encodeURIComponent(restaurant.address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  return (
    <div className="space-y-2 sm:space-y-3 md:space-y-4">
      <div className="space-y-2 sm:space-y-3">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold">Nearby Restaurants</h2>
        <div className="flex items-center gap-2 sm:gap-3">
          <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground flex-shrink-0" />
          <Input
            type="text"
            placeholder="Enter location..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="flex-1 text-xs sm:text-sm h-9 sm:h-10"
          />
        </div>
      </div>

      {/* Interactive Map */}
      <div 
        ref={mapContainer} 
        className="h-[200px] sm:h-[250px] md:h-[300px] w-full bg-muted rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden border border-border sm:border-2"
        id="mapbox-container"
      />

      {/* Restaurant List */}
      <div className="grid gap-2 sm:gap-3 md:gap-4">
        {restaurants.map((restaurant, index) => (
          <Card 
            key={restaurant.id} 
            className="overflow-hidden hover:shadow-float transition-shadow cursor-pointer"
            onClick={() => setSelectedRestaurant(restaurant)}
          >
            <div className="flex gap-2 sm:gap-3 md:gap-4 p-2 sm:p-3 md:p-4">
              <div className="relative flex-shrink-0">
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-md sm:rounded-lg object-cover bg-muted"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop';
                  }}
                />
                <div className="absolute -top-1 -left-1 sm:-top-2 sm:-left-2 bg-primary text-primary-foreground rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-[10px] sm:text-xs font-bold">
                  {index + 1}
                </div>
              </div>
              
              <div className="flex-1 space-y-1 sm:space-y-1.5 md:space-y-2 min-w-0">
                <div>
                  <h3 className="font-semibold text-sm sm:text-base md:text-lg leading-tight truncate">{restaurant.name}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">{restaurant.cuisine}</p>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 md:gap-3 text-xs sm:text-sm">
                  <div className="flex items-center gap-0.5 sm:gap-1">
                    <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 fill-secondary text-secondary flex-shrink-0" />
                    <span>{restaurant.rating}</span>
                  </div>
                  <div className="flex items-center gap-0.5 sm:gap-1">
                    <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 flex-shrink-0" />
                    <span>{restaurant.distance} mi</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGetDirections(restaurant);
                    }}
                    className="h-7 sm:h-8 w-7 sm:w-8 p-0 min-h-[28px] sm:min-h-[32px] min-w-[28px] sm:min-w-[32px] touch-manipulation flex items-center justify-center"
                  >
                    <Navigation className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {selectedRestaurant && (
        <>
          <Dialog open={!!selectedRestaurant} onOpenChange={(open) => !open && setSelectedRestaurant(null)}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-2 sm:p-4 md:p-6 w-[calc(100%-0.5rem)] sm:w-[calc(100%-2rem)] md:w-full max-w-[98vw] sm:max-w-2xl mx-auto">
              <div className="relative w-full flex justify-center items-center">
                <div className="w-full max-w-full">
                  <RestaurantCard
                    restaurant={selectedRestaurant}
                    variant="dialog"
                    onGetDirections={() => handleGetDirections(selectedRestaurant)}
                    onSeeReviews={() => {
                      setShowReviews(true);
                      setSelectedRestaurant(null);
                    }}
                  />
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {showReviews && (
            <ReviewsDialog
              restaurant={selectedRestaurant}
              open={showReviews}
              onOpenChange={(open) => {
                setShowReviews(open);
                if (!open) {
                  setSelectedRestaurant(null);
                }
              }}
            />
          )}
        </>
      )}
    </div>
  );
};
