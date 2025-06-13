export interface Beer {
  id: string;
  name: string;
  image: string;
  rating: number; // 1-10
  comments: string;
  dateAdded: Date;
}

export type SortOption = "date" | "name" | "rating";

export interface BeerFilters {
  sortBy: SortOption;
  sortOrder: "asc" | "desc";
}
