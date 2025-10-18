import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { UserPreferences } from "@/types";
import { foodTags } from "@/data/mockRestaurants";
import { MapPin, ChevronRight } from "lucide-react";
import logo from "@/assets/logo.png";
interface OnboardingFlowProps {
  onComplete: (preferences: UserPreferences) => void;
}
export const OnboardingFlow = ({
  onComplete
}: OnboardingFlowProps) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };
  const handleComplete = () => {
    onComplete({
      name,
      location,
      tags: selectedTags
    });
  };
  return <div className="min-h-screen bg-gradient-warm flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 animate-scale-in">
        {step === 1 && <div className="space-y-6">
            <div className="text-center space-y-4">
              <img src={logo} alt="Choose Eat" className="h-60 w-auto mx-auto" />
              
            </div>

            <div className="bg-card rounded-2xl p-8 shadow-card space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">What's your name?</label>
                <Input placeholder="Enter your name" value={name} onChange={e => setName(e.target.value)} className="h-12 text-base" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Where are you?
                </label>
                <Input placeholder="City or ZIP code" value={location} onChange={e => setLocation(e.target.value)} className="h-12 text-base" />
              </div>

              <Button variant="gradient" size="xl" className="w-full" onClick={() => setStep(2)} disabled={!name || !location}>
                Continue
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>}

        {step === 2 && <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold">What do you like?</h2>
              <p className="text-muted-foreground">
                Select your food preferences (choose at least 3)
              </p>
            </div>

            <div className="bg-card rounded-2xl p-8 shadow-card space-y-6">
              <div className="flex flex-wrap gap-2">
                {foodTags.map(tag => <Badge key={tag} variant={selectedTags.includes(tag) ? "default" : "outline"} className={`cursor-pointer py-2 px-4 text-sm transition-all hover:scale-105 ${selectedTags.includes(tag) ? "bg-gradient-primary border-0" : ""}`} onClick={() => toggleTag(tag)}>
                    {tag}
                  </Badge>)}
              </div>

              <Button variant="gradient" size="xl" className="w-full" onClick={handleComplete} disabled={selectedTags.length < 3}>
                Start Discovering
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>}
      </div>
    </div>;
};