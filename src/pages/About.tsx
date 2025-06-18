import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Beer, Star, Users, Smartphone, LogIn } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-yellow-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-amber-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
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

            <Link to="/login">
              <Button className="gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                <LogIn className="w-4 h-4" />
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center">
              <Beer className="w-10 h-10 text-amber-500" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Track Your Beer Journey
            </h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              BrewReviews is your personal beer tasting companion. Rate, review,
              and remember every brew you try with our elegant and intuitive
              review system.
            </p>
            <Link to="/login">
              <Button
                size="lg"
                className="gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-lg px-8 py-3"
              >
                <LogIn className="w-5 h-5" />
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">
              Everything You Need to Track Your Brews
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Simple, powerful features designed for beer enthusiasts who want
              to remember and share their tasting experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="space-y-4">
                <div className="w-12 h-12 mx-auto bg-amber-100 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-amber-600" />
                </div>
                <h4 className="text-lg font-semibold">Smart Ratings</h4>
                <p className="text-sm text-muted-foreground">
                  Rate beers from 1-10 with visual feedback that gets brighter
                  and greener as scores improve.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="space-y-4">
                <div className="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                  <Beer className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="text-lg font-semibold">Rich Reviews</h4>
                <p className="text-sm text-muted-foreground">
                  Add photos, detailed tasting notes, and track when you tried
                  each beer.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="space-y-4">
                <div className="w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="text-lg font-semibold">Smart Filtering</h4>
                <p className="text-sm text-muted-foreground">
                  Sort and filter by date, name, or rating to quickly find your
                  favorites.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="space-y-4">
                <div className="w-12 h-12 mx-auto bg-purple-100 rounded-full flex items-center justify-center">
                  <Smartphone className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="text-lg font-semibold">Mobile Ready</h4>
                <p className="text-sm text-muted-foreground">
                  Beautiful, responsive design that works perfectly on any
                  device.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-3xl font-bold text-foreground mb-4">
              Ready to Start Your Beer Journey?
            </h3>
            <p className="text-muted-foreground mb-8">
              Join BrewReviews today and never forget a great beer again. Create
              detailed reviews, track your favorites, and discover new brews.
            </p>
            <Link to="/login">
              <Button
                size="lg"
                className="gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-lg px-8 py-3"
              >
                <LogIn className="w-5 h-5" />
                Sign In to Continue
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/80 border-t border-amber-200 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Beer className="w-5 h-5 text-amber-500" />
            <span className="font-semibold">BrewReviews</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Your personal beer tasting journal. Drink responsibly.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default About;
