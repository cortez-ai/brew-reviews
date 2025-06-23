import React, { createContext, useContext, useReducer, ReactNode } from "react";
import {
  Beer,
  BeerFilters,
  CreateBeerData,
  UpdateBeerData,
} from "@/types/beer";
import { useAuth } from "@/contexts/AuthContext";
import {
  createBeerReview,
  getBeerReviewsByUser,
  updateBeerReview,
  deleteBeerReview,
} from "@/lib/database";

interface BeerState {
  beers: Beer[];
  filters: BeerFilters;
  isLoading: boolean;
}

type BeerAction =
  | { type: "SET_BEERS"; payload: Beer[] }
  | { type: "ADD_BEER"; payload: Beer }
  | { type: "UPDATE_BEER"; payload: Beer }
  | { type: "DELETE_BEER"; payload: number }
  | { type: "SET_FILTERS"; payload: BeerFilters }
  | { type: "SET_LOADING"; payload: boolean };

interface BeerContextType {
  state: BeerState;
  addBeer: (beer: CreateBeerData) => Promise<void>;
  updateBeer: (beer: UpdateBeerData) => Promise<void>;
  deleteBeer: (id: number) => Promise<void>;
  setFilters: (filters: BeerFilters) => void;
  getFilteredBeers: () => Beer[];
  loadBeers: () => Promise<void>;
}

const BeerContext = createContext<BeerContextType | undefined>(undefined);

const initialState: BeerState = {
  beers: [],
  filters: {
    sortBy: "date",
    sortOrder: "desc",
  },
  isLoading: false,
};

function beerReducer(state: BeerState, action: BeerAction): BeerState {
  switch (action.type) {
    case "SET_BEERS":
      return {
        ...state,
        beers: action.payload,
        isLoading: false,
      };
    case "ADD_BEER":
      return {
        ...state,
        beers: [action.payload, ...state.beers],
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
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
}

export function BeerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(beerReducer, initialState);
  const { state: authState } = useAuth();

  // Load beers when user authenticates
  React.useEffect(() => {
    if (authState.isAuthenticated && authState.user) {
      loadBeers();
    } else {
      // Clear beers when user logs out
      dispatch({ type: "SET_BEERS", payload: [] });
    }
  }, [authState.isAuthenticated, authState.user]);

  const loadBeers = async () => {
    if (!authState.user) return;

    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const beers = await getBeerReviewsByUser(authState.user.id);

      // Convert date strings to Date objects and ensure rating is a number
      const formattedBeers = beers.map((beer) => ({
        ...beer,
        rating:
          typeof beer.rating === "string"
            ? parseFloat(beer.rating)
            : beer.rating,
        date_added: new Date(beer.date_added),
      }));

      dispatch({ type: "SET_BEERS", payload: formattedBeers });
    } catch (error) {
      console.error("Failed to load beers:", error);
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const addBeer = async (beerData: CreateBeerData) => {
    if (!authState.user) throw new Error("User not authenticated");

    try {
      const newBeer = await createBeerReview(authState.user.id, beerData);
      dispatch({
        type: "ADD_BEER",
        payload: {
          ...newBeer,
          rating:
            typeof newBeer.rating === "string"
              ? parseFloat(newBeer.rating)
              : newBeer.rating,
          date_added: new Date(newBeer.date_added),
        },
      });
    } catch (error) {
      console.error("Failed to add beer:", error);
      throw error;
    }
  };

  const updateBeer = async (beerData: UpdateBeerData) => {
    if (!authState.user) throw new Error("User not authenticated");

    try {
      const updatedBeer = await updateBeerReview(
        beerData.id,
        authState.user.id,
        {
          name: beerData.name,
          image: beerData.image,
          rating: beerData.rating,
          comments: beerData.comments,
        },
      );

      if (updatedBeer) {
        dispatch({
          type: "UPDATE_BEER",
          payload: {
            ...updatedBeer,
            rating:
              typeof updatedBeer.rating === "string"
                ? parseFloat(updatedBeer.rating)
                : updatedBeer.rating,
            date_added: new Date(updatedBeer.date_added),
          },
        });
      }
    } catch (error) {
      console.error("Failed to update beer:", error);
      throw error;
    }
  };

  const deleteBeer = async (id: number) => {
    if (!authState.user) throw new Error("User not authenticated");

    try {
      await deleteBeerReview(id, authState.user.id);
      dispatch({ type: "DELETE_BEER", payload: id });
    } catch (error) {
      console.error("Failed to delete beer:", error);
      throw error;
    }
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
          comparison = a.date_added.getTime() - b.date_added.getTime();
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
        loadBeers,
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
