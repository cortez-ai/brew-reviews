import { BeerFilters, SortOption } from "@/types/beer";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Filter, SortAsc, SortDesc, Calendar, Star, Type } from "lucide-react";

interface FilterSortProps {
  filters: BeerFilters;
  onFiltersChange: (filters: BeerFilters) => void;
}

export function FilterSort({ filters, onFiltersChange }: FilterSortProps) {
  const sortOptions: {
    value: SortOption;
    label: string;
    icon: React.ReactNode;
  }[] = [
    {
      value: "date",
      label: "Date Added",
      icon: <Calendar className="w-4 h-4" />,
    },
    { value: "name", label: "Name", icon: <Type className="w-4 h-4" /> },
    { value: "rating", label: "Rating", icon: <Star className="w-4 h-4" /> },
  ];

  const currentSortOption = sortOptions.find(
    (option) => option.value === filters.sortBy,
  );

  const handleSortChange = (sortBy: SortOption) => {
    onFiltersChange({
      ...filters,
      sortBy,
    });
  };

  const handleOrderToggle = () => {
    onFiltersChange({
      ...filters,
      sortOrder: filters.sortOrder === "asc" ? "desc" : "asc",
    });
  };

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Sort by {currentSortOption?.label}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {sortOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => handleSortChange(option.value)}
              className="gap-2"
            >
              {option.icon}
              {option.label}
              {filters.sortBy === option.value && (
                <div className="ml-auto w-2 h-2 bg-primary rounded-full" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        variant="outline"
        size="icon"
        onClick={handleOrderToggle}
        title={`Sort ${filters.sortOrder === "asc" ? "Ascending" : "Descending"}`}
      >
        {filters.sortOrder === "asc" ? (
          <SortAsc className="w-4 h-4" />
        ) : (
          <SortDesc className="w-4 h-4" />
        )}
      </Button>
    </div>
  );
}
