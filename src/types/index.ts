export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  image: string;
  rating: number;
  priceRange: "$" | "$$" | "$$$" | "$$$$";
  distance: number;
  tags: string[];
  description: string;
  address: string;
  latitude: number;
  longitude: number;
}

export interface UserPreferences {
  name: string;
  location: string;
  tags: string[];
}

export interface SwipeAction {
  restaurantId: string;
  direction: "left" | "right";
}
