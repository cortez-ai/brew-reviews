import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useBeer } from "@/contexts/BeerContext";
import { useAuth } from "@/contexts/AuthContext";
import { BeerForm } from "@/components/BeerForm";
import { RatingDisplay, RatingBar } from "@/components/RatingDisplay";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowLeft,
  Edit3,
  Trash2,
  Calendar,
  MessageSquare,
  Beer,
  User,
  LogOut,
} from "lucide-react";
import { formatDate } from "@/lib/beer-utils";
import { CreateBeerData } from "@/types/beer";
import { toast } from "sonner";

const BeerDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, updateBeer, deleteBeer } = useBeer();
  const { state: authState, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const beer = state.beers.find((b) => b.id === parseInt(id || "0", 10));

  if (!beer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center">
            <Beer className="w-12 h-12 text-amber-500" />
          </div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            Beer Not Found
          </h2>
          <p className="text-muted-foreground mb-6">
            The beer you're looking for doesn't exist or has been deleted.
          </p>
          <Link to="/">
            <Button className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleUpdateBeer = async (beerData: CreateBeerData) => {
    try {
      await updateBeer({
        id: beer.id,
        ...beerData,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update beer:", error);
      // Error is handled in the form component
    }
  };

  const handleDeleteBeer = async () => {
    try {
      await deleteBeer(beer.id);
      toast.success("Beer deleted successfully!");
      navigate("/");
    } catch (error) {
      console.error("Failed to delete beer:", error);
      toast.error("Failed to delete beer. Please try again.");
    }
  };

  if (isEditing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-yellow-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => setIsEditing(false)}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Cancel Edit
            </Button>
          </div>
          <BeerForm
            beer={beer}
            onSubmit={handleUpdateBeer}
            onCancel={() => setIsEditing(false)}
            isEditing={true}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-yellow-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-amber-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Beers
              </Button>
            </Link>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
                className="gap-2"
              >
                <Edit3 className="w-4 h-4" />
                Edit
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(true)}
                className="gap-2 text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
                Delete
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Image Section */}
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <div className="aspect-square relative">
                <img
                  src={beer.image}
                  alt={beer.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder.svg";
                  }}
                />
              </div>
            </Card>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {beer.name}
              </h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Added {formatDate(beer.date_added)}</span>
                </div>
              </div>
            </div>

            {/* Rating */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Rating
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <RatingDisplay rating={beer.rating} size="lg" showStars />
                </div>
                <RatingBar rating={beer.rating} />
              </CardContent>
            </Card>

            {/* Comments */}
            {beer.comments && (
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Tasting Notes
                  </h3>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                    {beer.comments}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Beer Review</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{beer.name}"? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteBeer}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BeerDetail;
