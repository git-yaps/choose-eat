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
  const [mapboxToken, setMapboxToken] = useState("");
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken || map.current) return;

    mapboxgl.accessToken = mapboxToken;
    
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

    // Add markers for each restaurant
    restaurants.forEach((restaurant, index) => {
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.backgroundImage = 'url(https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png)';
      el.style.width = '40px';
      el.style.height = '40px';
      el.style.backgroundSize = 'contain';
      el.style.cursor = 'pointer';

      const numberEl = document.createElement('div');
      numberEl.textContent = `${index + 1}`;
      numberEl.style.position = 'absolute';
      numberEl.style.top = '8px';
      numberEl.style.left = '50%';
      numberEl.style.transform = 'translateX(-50%)';
      numberEl.style.color = 'white';
      numberEl.style.fontWeight = 'bold';
      numberEl.style.fontSize = '12px';
      el.appendChild(numberEl);

      new mapboxgl.Marker(el)
        .setLngLat([restaurant.longitude, restaurant.latitude])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<div style="padding: 8px;">
              <h3 style="font-weight: bold; margin-bottom: 4px;">${restaurant.name}</h3>
              <p style="color: #666; font-size: 14px; margin-bottom: 4px;">${restaurant.cuisine}</p>
              <p style="font-size: 12px;">⭐ ${restaurant.rating} • ${restaurant.priceRange}</p>
            </div>`
          )
        )
        .addTo(map.current!);
    });

    setIsMapLoaded(true);

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [restaurants, mapboxToken]);

  const handleGetDirections = (restaurant: Restaurant) => {
    const query = encodeURIComponent(restaurant.address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Nearby Restaurants</h2>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span>{userLocation}</span>
        </div>
      </div>

      {/* Mapbox Token Input */}
      {!isMapLoaded && (
        <Card className="p-4 space-y-3">
          <div className="space-y-2">
            <label className="text-sm font-medium">Enter your Mapbox Public Token</label>
            <p className="text-xs text-muted-foreground">
              Get your free token at{" "}
              <a 
                href="https://account.mapbox.com/access-tokens/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                mapbox.com
              </a>
            </p>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="pk.eyJ1..."
                value={mapboxToken}
                onChange={(e) => setMapboxToken(e.target.value)}
              />
              <Button onClick={() => setMapboxToken(mapboxToken)} disabled={!mapboxToken}>
                Load Map
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Interactive Map */}
      <div 
        ref={mapContainer} 
        className="h-[500px] w-full bg-muted rounded-2xl overflow-hidden border-2 border-border"
        style={{ display: isMapLoaded ? 'block' : 'none' }}
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
