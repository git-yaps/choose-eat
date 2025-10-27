import { Restaurant } from "@/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

      new mapboxgl.Marker(el)
        .setLngLat([restaurant.longitude, restaurant.latitude])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<div style="padding: 12px; font-family: 'DM Sans', sans-serif;">
              <h3 style="font-weight: 700; margin-bottom: 6px; font-size: 16px;">${restaurant.name}</h3>
              <p style="color: #666; font-size: 14px; margin-bottom: 6px;">${restaurant.cuisine}</p>
              <p style="font-size: 13px; margin-bottom: 4px;">⭐ ${restaurant.rating} • ${restaurant.priceRange}</p>
              <p style="color: #C2410C; font-weight: 600; font-size: 14px;">₱${restaurant.priceMin} - ₱${restaurant.priceMax}</p>
            </div>`
          )
        )
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
    <div className="space-y-4">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">Nearby Restaurants</h2>
        <div className="flex items-center gap-3">
          <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <Input
            type="text"
            placeholder="Enter location..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="flex-1"
          />
        </div>
      </div>

      {/* Interactive Map */}
      <div 
        ref={mapContainer} 
        className="h-[500px] w-full bg-muted rounded-2xl overflow-hidden border-2 border-border"
        id="mapbox-container"
      />

      {/* Restaurant List */}
      <div className="grid gap-4">
        {restaurants.map((restaurant, index) => (
          <Card key={restaurant.id} className="overflow-hidden hover:shadow-float transition-shadow">
            <div className="flex gap-4 p-4">
              <div className="relative">
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-24 h-24 rounded-lg object-cover"
                />
                <div className="absolute -top-2 -left-2 bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </div>
              </div>
              
              <div className="flex-1 space-y-2">
                <div>
                  <h3 className="font-semibold text-lg">{restaurant.name}</h3>
                  <p className="text-sm text-muted-foreground">{restaurant.cuisine}</p>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-secondary text-secondary" />
                    <span>{restaurant.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{restaurant.distance} mi</span>
                  </div>
                  <Badge variant="secondary">{restaurant.priceRange}</Badge>
                </div>

                <p className="text-sm font-semibold text-primary">
                  ₱{restaurant.priceMin} - ₱{restaurant.priceMax}
                </p>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleGetDirections(restaurant)}
                  className="w-full"
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Get Directions
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
