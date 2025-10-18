import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Restaurant } from "@/types";
import { mockRestaurants, foodTags } from "@/data/mockRestaurants";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [restaurants, setRestaurants] = useState<Restaurant[]>(mockRestaurants);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    cuisine: "",
    image: "",
    description: "",
    address: "",
    priceRange: "$$" as Restaurant["priceRange"],
    distance: 0,
    rating: 4.0,
    selectedTags: [] as string[],
  });

  const handleTagToggle = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      selectedTags: prev.selectedTags.includes(tag)
        ? prev.selectedTags.filter(t => t !== tag)
        : [...prev.selectedTags, tag]
    }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.cuisine || !formData.address) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const newRestaurant: Restaurant = {
      id: Date.now().toString(),
      name: formData.name,
      cuisine: formData.cuisine,
      image: formData.image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
      description: formData.description,
      address: formData.address,
      priceRange: formData.priceRange,
      distance: formData.distance,
      rating: formData.rating,
      tags: formData.selectedTags,
      latitude: 0,
      longitude: 0,
    };

    setRestaurants([newRestaurant, ...restaurants]);
    setShowForm(false);
    setFormData({
      name: "",
      cuisine: "",
      image: "",
      description: "",
      address: "",
      priceRange: "$$",
      distance: 0,
      rating: 4.0,
      selectedTags: [],
    });

    toast({
      title: "Restaurant added!",
      description: "The restaurant has been added successfully.",
    });
  };

  const handleDelete = (id: string) => {
    setRestaurants(restaurants.filter(r => r.id !== id));
    toast({
      title: "Restaurant removed",
      description: "The restaurant has been deleted.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-warm">
      <header className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-40">
        <div className="container max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/")}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            </div>
            <Button
              variant="gradient"
              onClick={() => setShowForm(!showForm)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Restaurant
            </Button>
          </div>
        </div>
      </header>

      <main className="container max-w-4xl mx-auto px-4 py-8 space-y-6">
        {showForm && (
          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">Add New Restaurant</h2>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Restaurant Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Joe's Pizza"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cuisine">Cuisine Type *</Label>
                <Input
                  id="cuisine"
                  value={formData.cuisine}
                  onChange={(e) => setFormData({ ...formData, cuisine: e.target.value })}
                  placeholder="Italian"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="123 Main St, City"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price Range</Label>
                <select
                  id="price"
                  value={formData.priceRange}
                  onChange={(e) => setFormData({ ...formData, priceRange: e.target.value as Restaurant["priceRange"] })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                >
                  <option value="$">$ - Budget</option>
                  <option value="$$">$$ - Moderate</option>
                  <option value="$$$">$$$ - Upscale</option>
                  <option value="$$$$">$$$$ - Fine Dining</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="distance">Distance (miles)</Label>
                <Input
                  id="distance"
                  type="number"
                  step="0.1"
                  value={formData.distance}
                  onChange={(e) => setFormData({ ...formData, distance: parseFloat(e.target.value) })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the restaurant..."
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2">
                {foodTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={formData.selectedTags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleTagToggle(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="gradient" onClick={handleSubmit} className="flex-1">
                Add Restaurant
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </Card>
        )}

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">
            Restaurant Listings ({restaurants.length})
          </h2>

          <div className="grid gap-4">
            {restaurants.map((restaurant) => (
              <Card key={restaurant.id} className="overflow-hidden">
                <div className="flex gap-4 p-4">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{restaurant.name}</h3>
                        <p className="text-sm text-muted-foreground">{restaurant.cuisine}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(restaurant.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <p className="text-sm">{restaurant.address}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">{restaurant.priceRange}</Badge>
                      <Badge variant="secondary">⭐ {restaurant.rating}</Badge>
                      <Badge variant="secondary">{restaurant.distance} mi</Badge>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;
