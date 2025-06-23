import { useState } from "react";
import { Link } from "react-router-dom";
import { useBeer } from "@/contexts/BeerContext";
import { useAuth } from "@/contexts/AuthContext";
import { BeerCard } from "@/components/BeerCard";
import { FilterSort } from "@/components/FilterSort";
import { BeerForm } from "@/components/BeerForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, Search, Beer, User, LogOut } from "lucide-react";
import { CreateBeerData } from "@/types/beer";

const Index = () => {
  const { getFilteredBeers, state, setFilters, addBeer } = useBeer();
  const { state: authState, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const filteredBeers = getFilteredBeers().filter((beer) =>
    beer.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleAddBeer = async (beerData: CreateBeerData) => {
    try {
      await addBeer(beerData);
      setShowAddForm(false);
    } catch (error) {
      console.error("Failed to add beer:", error);
      // Error is handled in the form component
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-yellow-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-amber-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl shadow-lg">
                <Beer className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  BrewReviews
                </h1>
                <p className="text-sm text-muted-foreground">
                  Your personal beer tasting journal
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={() => setShowAddForm(true)}
                className="gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
              >
                <Plus className="w-4 h-4" />
                Add Beer
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <User className="w-4 h-4" />
                    {authState.user?.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={logout}
                    className="gap-2 text-destructive"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="flex flex-col gap-4 mb-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search beers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <FilterSort filters={state.filters} onFiltersChange={setFilters} />
        </div>

        {/* Beer Grid */}
        {state.isLoading ? (
          <div className="text-center py-16">
            <div className="w-12 h-12 mx-auto mb-4 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin"></div>
            <p className="text-muted-foreground">
              Loading your beer reviews...
            </p>
          </div>
        ) : filteredBeers.length > 0 ? (
          <>
            <div className="mb-4 text-sm text-muted-foreground">
              Showing {filteredBeers.length} beer
              {filteredBeers.length !== 1 ? "s" : ""}
              {searchQuery && ` matching "${searchQuery}"`}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBeers.map((beer) => (
                <Link key={beer.id} to={`/beer/${beer.id}`}>
                  <BeerCard beer={beer} onClick={() => {}} />
                </Link>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center">
              <Beer className="w-12 h-12 text-amber-500" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {searchQuery ? "No beers found" : "No beers yet"}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {searchQuery
                ? `No beers match "${searchQuery}". Try a different search term.`
                : "Start your beer journey by adding your first review!"}
            </p>
            {!searchQuery && (
              <Button
                onClick={() => setShowAddForm(true)}
                className="gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
              >
                <Plus className="w-4 h-4" />
                Add Your First Beer
              </Button>
            )}
          </div>
        )}
      </main>

      {/* Add Beer Dialog */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Beer Review</DialogTitle>
          </DialogHeader>
          <BeerForm
            onSubmit={handleAddBeer}
            onCancel={() => setShowAddForm(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
