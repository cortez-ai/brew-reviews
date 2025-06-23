export interface Beer {
  id: number; // Changed from string to number for database
  user_id: number;
  name: string;
  image: string;
  rating: number; // 1-10
  comments: string;
  date_added: Date; // Changed from dateAdded to match database
}

export type SortOption = "date" | "name" | "rating";

export interface BeerFilters {
  sortBy: SortOption;
  sortOrder: "asc" | "desc";
}

// For creating new beers (without id and date_added)
export type CreateBeerData = Omit<Beer, "id" | "user_id" | "date_added">;

// For updating beers (without user_id and date_added)
export type UpdateBeerData = Omit<Beer, "user_id" | "date_added">;
