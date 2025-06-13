import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { Beer, BeerFilters } from "@/types/beer";

interface BeerState {
  beers: Beer[];
  filters: BeerFilters;
}

type BeerAction =
  | { type: "ADD_BEER"; payload: Beer }
  | { type: "UPDATE_BEER"; payload: Beer }
  | { type: "DELETE_BEER"; payload: string }
  | { type: "SET_FILTERS"; payload: BeerFilters }
  | { type: "LOAD_BEERS"; payload: Beer[] };

interface BeerContextType {
  state: BeerState;
  addBeer: (beer: Omit<Beer, "id" | "dateAdded">) => void;
  updateBeer: (beer: Beer) => void;
  deleteBeer: (id: string) => void;
  setFilters: (filters: BeerFilters) => void;
  getFilteredBeers: () => Beer[];
}

const BeerContext = createContext<BeerContextType | undefined>(undefined);

const initialState: BeerState = {
  beers: [],
  filters: {
    sortBy: "date",
    sortOrder: "desc",
  },
};

function beerReducer(state: BeerState, action: BeerAction): BeerState {
  switch (action.type) {
    case "ADD_BEER":
      return {
        ...state,
        beers: [...state.beers, action.payload],
      };
    case "UPDATE_BEER":
      return {
        ...state,
        beers: state.beers.map((beer) =>
          beer.id === action.payload.id ? action.payload : beer,
        ),
      };
    case "DELETE_BEER":
      return {
        ...state,
        beers: state.beers.filter((beer) => beer.id !== action.payload),
      };
    case "SET_FILTERS":
      return {
        ...state,
        filters: action.payload,
      };
    case "LOAD_BEERS":
      return {
        ...state,
        beers: action.payload,
      };
    default:
      return state;
  }
}

export function BeerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(beerReducer, initialState);

  // Load beers from localStorage on mount
  React.useEffect(() => {
    const savedBeers = localStorage.getItem("beerReviews");
    if (savedBeers) {
      try {
        const beers = JSON.parse(savedBeers).map((beer: any) => ({
          ...beer,
          dateAdded: new Date(beer.dateAdded),
        }));
        dispatch({ type: "LOAD_BEERS", payload: beers });
      } catch (error) {
        console.error("Failed to load beers from localStorage:", error);
      }
    }
  }, []);

  // Save beers to localStorage whenever beers change
  React.useEffect(() => {
    localStorage.setItem("beerReviews", JSON.stringify(state.beers));
  }, [state.beers]);

  const addBeer = (beerData: Omit<Beer, "id" | "dateAdded">) => {
    const beer: Beer = {
      ...beerData,
      id: crypto.randomUUID(),
      dateAdded: new Date(),
    };
    dispatch({ type: "ADD_BEER", payload: beer });
  };

  const updateBeer = (beer: Beer) => {
    dispatch({ type: "UPDATE_BEER", payload: beer });
  };

  const deleteBeer = (id: string) => {
    dispatch({ type: "DELETE_BEER", payload: id });
  };

  const setFilters = (filters: BeerFilters) => {
    dispatch({ type: "SET_FILTERS", payload: filters });
  };

  const getFilteredBeers = (): Beer[] => {
    const { sortBy, sortOrder } = state.filters;
    const sorted = [...state.beers].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "rating":
          comparison = a.rating - b.rating;
          break;
        case "date":
          comparison = a.dateAdded.getTime() - b.dateAdded.getTime();
          break;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return sorted;
  };

  return (
    <BeerContext.Provider
      value={{
        state,
        addBeer,
        updateBeer,
        deleteBeer,
        setFilters,
        getFilteredBeers,
      }}
    >
      {children}
    </BeerContext.Provider>
  );
}

export function useBeer() {
  const context = useContext(BeerContext);
  if (context === undefined) {
    throw new Error("useBeer must be used within a BeerProvider");
  }
  return context;
}
