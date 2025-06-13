import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Beer, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-yellow-50">
      <div className="text-center">
        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center">
          <Beer className="w-12 h-12 text-amber-500" />
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-4">404</h1>
        <h2 className="text-xl font-semibold text-foreground mb-2">
          This beer can't be found!
        </h2>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          The page you're looking for has gone flat. Let's get you back to the
          good stuff.
        </p>
        <Link to="/">
          <Button className="gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
            <Home className="w-4 h-4" />
            Back to BrewReviews
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
