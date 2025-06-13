import { getRatingColor, getRatingBgColor } from "@/lib/beer-utils";
import { Star } from "lucide-react";

interface RatingDisplayProps {
  rating: number;
  showStars?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function RatingDisplay({
  rating,
  showStars = false,
  size = "md",
  className = "",
}: RatingDisplayProps) {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl",
  };

  const starSizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  if (showStars) {
    const filledStars = Math.floor(rating / 2);
    const hasHalfStar = rating % 2 >= 1;
    const emptyStars = 5 - filledStars - (hasHalfStar ? 1 : 0);

    return (
      <div className={`flex items-center gap-1 ${className}`}>
        {/* Filled stars */}
        {Array.from({ length: filledStars }).map((_, i) => (
          <Star
            key={`filled-${i}`}
            className={`${starSizeClasses[size]} fill-yellow-400 text-yellow-400`}
          />
        ))}

        {/* Half star */}
        {hasHalfStar && (
          <div className="relative">
            <Star className={`${starSizeClasses[size]} text-gray-300`} />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star
                className={`${starSizeClasses[size]} fill-yellow-400 text-yellow-400`}
              />
            </div>
          </div>
        )}

        {/* Empty stars */}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star
            key={`empty-${i}`}
            className={`${starSizeClasses[size]} text-gray-300`}
          />
        ))}

        <span className={`ml-1 ${sizeClasses[size]} ${getRatingColor(rating)}`}>
          {rating.toFixed(1)}
        </span>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center ${className}`}>
      <span className={`${sizeClasses[size]} ${getRatingColor(rating)}`}>
        {rating.toFixed(1)}
      </span>
      <span className={`ml-1 ${sizeClasses[size]} text-muted-foreground`}>
        /10
      </span>
    </div>
  );
}

interface RatingBarProps {
  rating: number;
  className?: string;
}

export function RatingBar({ rating, className = "" }: RatingBarProps) {
  const percentage = (rating / 10) * 100;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${getRatingBgColor(rating)}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <RatingDisplay rating={rating} size="sm" />
    </div>
  );
}
