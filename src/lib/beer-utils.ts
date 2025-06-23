import { Beer } from "@/types/beer";

/**
 * Get rating color based on score (1-10)
 * Returns brighter, greener colors as rating approaches 10
 */
export function getRatingColor(rating: number): string {
  if (rating >= 9) return "text-emerald-500 font-bold";
  if (rating >= 8) return "text-emerald-400 font-semibold";
  if (rating >= 7) return "text-green-500 font-semibold";
  if (rating >= 6) return "text-lime-500 font-medium";
  if (rating >= 5) return "text-yellow-500 font-medium";
  if (rating >= 4) return "text-orange-500 font-medium";
  if (rating >= 3) return "text-orange-600 font-medium";
  return "text-red-500 font-medium";
}

/**
 * Get rating background color for visual elements
 */
export function getRatingBgColor(rating: number): string {
  if (rating >= 9) return "bg-emerald-500";
  if (rating >= 8) return "bg-emerald-400";
  if (rating >= 7) return "bg-green-500";
  if (rating >= 6) return "bg-lime-500";
  if (rating >= 5) return "bg-yellow-500";
  if (rating >= 4) return "bg-orange-500";
  if (rating >= 3) return "bg-orange-600";
  return "bg-red-500";
}

/**
 * Format date for display
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

/**
 * Validate beer form data
 */
export function validateBeer(
  data: Partial<Pick<Beer, "name" | "image" | "rating" | "comments">>,
): string[] {
  const errors: string[] = [];

  if (!data.name?.trim()) {
    errors.push("Beer name is required");
  }

  if (!data.image?.trim()) {
    errors.push("Beer image is required");
  }

  if (data.rating === undefined || data.rating < 1 || data.rating > 10) {
    errors.push("Rating must be between 1 and 10");
  }

  if (!data.comments?.trim()) {
    errors.push("Comments are required");
  }

  return errors;
}

/**
 * Generate a placeholder image URL for beer
 */
export function getPlaceholderImage(): string {
  return "/placeholder.svg";
}
