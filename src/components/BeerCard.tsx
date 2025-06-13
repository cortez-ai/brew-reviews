import { Beer } from "@/types/beer";
import { Card, CardContent } from "@/components/ui/card";
import { RatingDisplay } from "./RatingDisplay";
import { formatDate } from "@/lib/beer-utils";
import { Calendar, MessageSquare } from "lucide-react";

interface BeerCardProps {
  beer: Beer;
  onClick: () => void;
}

export function BeerCard({ beer, onClick }: BeerCardProps) {
  return (
    <Card
      className="group cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1 overflow-hidden bg-gradient-to-br from-white to-amber-50/50 border-amber-200"
      onClick={onClick}
    >
      <div className="aspect-square relative overflow-hidden">
        <img
          src={beer.image}
          alt={beer.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder.svg";
          }}
        />
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 shadow-sm">
          <RatingDisplay rating={beer.rating} size="sm" />
        </div>
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">
          {beer.name}
        </h3>

        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(beer.dateAdded)}</span>
          </div>
          {beer.comments && (
            <div className="flex items-center gap-1">
              <MessageSquare className="w-3 h-3" />
              <span>Has notes</span>
            </div>
          )}
        </div>

        {beer.comments && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {beer.comments}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
