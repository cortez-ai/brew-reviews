import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from "react";
import { createUser, getUserByEmail, initDatabase } from "@/lib/database";

interface User {
  id: number;
  email: string;
  name: string;
  created_at?: Date;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

type AuthAction =
  | { type: "LOGIN_SUCCESS"; payload: User }
  | { type: "LOGOUT" }
  | { type: "SET_LOADING"; payload: boolean };

interface AuthContextType {
  state: AuthState;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize database and load user from localStorage on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Initialize database tables
        await initDatabase();

        // Load user from localStorage
        const savedUser = localStorage.getItem("brewreviewsUser");
        if (savedUser) {
          try {
            const user = JSON.parse(savedUser);
            // Verify user still exists in database
            const dbUser = await getUserByEmail(user.email);
            if (dbUser) {
              dispatch({ type: "LOGIN_SUCCESS", payload: dbUser });
            } else {
              // User no longer exists in database
              localStorage.removeItem("brewreviewsUser");
              dispatch({ type: "SET_LOADING", payload: false });
            }
          } catch (error) {
            console.error("Failed to load user from localStorage:", error);
            localStorage.removeItem("brewreviewsUser");
            dispatch({ type: "SET_LOADING", payload: false });
          }
        } else {
          dispatch({ type: "SET_LOADING", payload: false });
        }
      } catch (error) {
        console.error("Failed to initialize auth:", error);
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    initializeAuth();
  }, []);

  // Save user to localStorage whenever user changes
  useEffect(() => {
    if (state.user) {
      localStorage.setItem("brewreviewsUser", JSON.stringify(state.user));
    } else {
      localStorage.removeItem("brewreviewsUser");
    }
  }, [state.user]);

  const login = async (email: string, password: string): Promise<boolean> => {
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For demo purposes, accept any email/password combination
      if (email && password) {
        // Check if user exists, if not create them
        let user = await getUserByEmail(email);
        if (!user) {
          const name = email.split("@")[0]; // Use part before @ as name
          user = await createUser(email, name);
        }

        if (user) {
          dispatch({ type: "LOGIN_SUCCESS", payload: user });
          return true;
        }
      }

      dispatch({ type: "SET_LOADING", payload: false });
      return false;
    } catch (error) {
      console.error("Login failed:", error);
      dispatch({ type: "SET_LOADING", payload: false });
      return false;
    }
  };

  const logout = () => {
    dispatch({ type: "LOGOUT" });
  };

  return (
    <AuthContext.Provider
      value={{
        state,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
