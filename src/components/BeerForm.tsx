import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { validateBeer } from "@/lib/beer-utils";
import { Beer } from "@/types/beer";
import { useState } from "react";
import { toast } from "sonner";
import { RatingDisplay } from "./RatingDisplay";

interface BeerFormProps {
  beer?: Beer;
  onSubmit: (beer: Omit<Beer, "id" | "dateAdded">) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

export function BeerForm({
  beer,
  onSubmit,
  onCancel,
  isEditing = false,
}: BeerFormProps) {
  const [formData, setFormData] = useState({
    name: beer?.name || "",
    image: beer?.image || "",
    rating: beer?.rating || 5,
    comments: beer?.comments || "",
  });

  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateBeer(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix the errors below");
      return;
    }

    setErrors([]);
    onSubmit(formData);
    toast.success(
      isEditing ? "Beer updated successfully!" : "Beer added successfully!",
    );
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🍺 {isEditing ? "Edit" : "Add New"} Beer Review
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.length > 0 && (
            <div className="bg-destructive/15 border border-destructive/50 rounded-lg p-3">
              <ul className="text-sm text-destructive">
                {errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Beer Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter beer name..."
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Image URL</Label>
            <Input
              id="image"
              type="url"
              value={formData.image}
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.value })
              }
              placeholder="https://example.com/beer-image.jpg"
            />
            {formData.image && (
              <div className="mt-2">
                <img
                  src={formData.image}
                  alt="Beer preview"
                  className="w-32 h-32 object-cover rounded-lg border"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder.svg";
                  }}
                />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <Label>Rating</Label>
            <div className="space-y-3">
              <Slider
                value={[formData.rating]}
                onValueChange={(e) =>
                  setFormData({ ...formData, rating: e[0] })
                }
                max={10}
                min={1}
                step={0.1}
                className="w-full"
              />
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">1 (Poor)</span>
                <RatingDisplay rating={formData.rating} size="lg" />
                <span className="text-sm text-muted-foreground">
                  10 (Excellent)
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comments">Comments</Label>
            <Textarea
              id="comments"
              value={formData.comments}
              onChange={(e) =>
                setFormData({ ...formData, comments: e.target.value })
              }
              placeholder="Share your thoughts about this beer..."
              rows={4}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              {isEditing ? "Update Beer" : "Add Beer"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
