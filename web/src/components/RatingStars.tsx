import React, { useState } from "react";
import { Rating } from "@smastrom/react-rating";
import { apiClient } from "@/utils/apiClient";

interface RatingStarsProps {
  value: number | null;
  orderId: string;
  readOnly?: boolean;
  onRatingUpdate?: (newRating: number) => void;
}

const RatingStars: React.FC<RatingStarsProps> = ({
  value,
  orderId,
  readOnly = true,
  onRatingUpdate,
}) => {
  const [rating, setRating] = useState<number | null>(value);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasRated, setHasRated] = useState(value !== null);

  const handleRatingChange = async (newRating: number) => {
    if (readOnly || hasRated || isSubmitting) return;

    setIsSubmitting(true);
    try {
      // Update rating in the database
      await apiClient.patch(`/orders/${orderId}/`, { rating: newRating });

      // Update local state
      setRating(newRating);
      setHasRated(true);

      // Notify parent component if callback provided
      if (onRatingUpdate) {
        onRatingUpdate(newRating);
      }
    } catch (error) {
      console.error("Failed to update rating:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // If there's no rating and we're not allowing rating interaction, return nothing
  if (rating === null && readOnly) {
    return null;
  }

  return (
    <div className={isSubmitting ? "opacity-50 pointer-events-none" : ""}>
      <Rating
        style={{ maxWidth: 120 }}
        value={rating || 0}
        onChange={handleRatingChange}
        readOnly={readOnly || hasRated}
      />
    </div>
  );
};

export default RatingStars;
