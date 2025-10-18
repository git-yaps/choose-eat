import { useState } from "react";
import { Restaurant } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Review {
  id: string;
  rating: number;
  comment: string;
  userName: string;
  date: string;
}

interface ReviewsDialogProps {
  restaurant: Restaurant;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ReviewsDialog = ({
  restaurant,
  open,
  onOpenChange,
}: ReviewsDialogProps) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const { toast } = useToast();

  const handleSubmit = () => {
    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a rating before submitting.",
        variant: "destructive",
      });
      return;
    }

    const newReview: Review = {
      id: Date.now().toString(),
      rating,
      comment: comment.trim(),
      userName: "You",
      date: new Date().toLocaleDateString(),
    };

    setReviews([newReview, ...reviews]);
    setRating(0);
    setComment("");

    toast({
      title: "Review submitted!",
      description: "Thank you for your feedback.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{restaurant.name}</DialogTitle>
          <DialogDescription>{restaurant.cuisine} • {restaurant.address}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Add Review Section */}
          <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
            <h3 className="font-semibold">Leave a Review</h3>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Your Rating:</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= rating
                          ? "fill-secondary text-secondary"
                          : "text-muted-foreground"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <Textarea
              placeholder="Share your experience (optional)..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[100px]"
            />

            <Button onClick={handleSubmit} variant="gradient" className="w-full">
              Submit Review
            </Button>
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            <h3 className="font-semibold">
              Reviews {reviews.length > 0 && `(${reviews.length})`}
            </h3>

            {reviews.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No reviews yet. Be the first to review!
              </p>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="p-4 bg-card rounded-lg border border-border space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{review.userName}</span>
                      <span className="text-xs text-muted-foreground">{review.date}</span>
                    </div>
                    
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= review.rating
                              ? "fill-secondary text-secondary"
                              : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>

                    {review.comment && (
                      <p className="text-sm leading-relaxed">{review.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
