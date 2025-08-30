import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CategoryCard } from '@/components/CategoryCard';
import { ListingCard } from '@/components/ListingCard';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'wouter';

export default function Home() {
  const { data: categories = [] } = useQuery({
    queryKey: ['/api/categories']
  });

  const { data: featuredListings = [] } = useQuery({
    queryKey: ['/api/listings/featured']
  });

  const { data: recentListingsData } = useQuery({
    queryKey: ['/api/listings?page=1&limit=8']
  });

  const recentListings = (recentListingsData as any)?.listings || [];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Banner */}
        <section className="hero-gradient py-8 lg:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Hero Card */}
              <div className="lg:col-span-2 bg-white rounded-xl shadow-lg overflow-hidden" data-testid="card-hero-main">
                <img 
                  src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400" 
                  alt="Modern furniture collection" 
                  className="w-full h-48 lg:h-64 object-cover"
                  data-testid="img-hero-furniture"
                />
                <div className="p-6">
                  <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-2" data-testid="text-hero-title">
                    Resale Furniture
                  </h2>
                  <p className="text-muted-foreground mb-4" data-testid="text-hero-description">
                    Find quality pre-owned furniture at amazing prices
                  </p>
                  <Link to="/category/furniture" data-testid="link-hero-browse">
                    <Button className="bg-primary text-white hover:bg-primary/90">
                      Browse Collection <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
              
              {/* Side Banner */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden" data-testid="card-hero-side">
                <img 
                  src="https://images.unsplash.com/photo-1627634777217-c864268db30c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300" 
                  alt="Modern white car" 
                  className="w-full h-32 lg:h-40 object-cover"
                  data-testid="img-hero-car"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-foreground mb-1" data-testid="text-hero-cars-title">
                    Premium Cars
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3" data-testid="text-hero-cars-description">
                    Verified dealers & owners
                  </p>
                  <Link to="/category/cars" className="text-primary font-medium hover:underline" data-testid="link-hero-cars">
                    Explore <i className="fas fa-external-link-alt ml-1 text-xs"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Categories */}
        <section className="py-8 lg:py-12 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-foreground" data-testid="text-categories-title">
                Popular Categories
              </h2>
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm" className="w-10 h-10 rounded-full" data-testid="button-categories-prev">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button size="sm" className="w-10 h-10 rounded-full" data-testid="button-categories-next">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-6">
              {categories.map((category: any) => (
                <CategoryCard 
                  key={category._id} 
                  category={category} 
                  adCount={Math.floor(Math.random() * 2000) + 100}
                />
              ))}
              
              <Link to="/categories" data-testid="link-view-all-categories">
                <div className="category-hover bg-muted rounded-xl p-6 text-center border border-border hover:shadow-md transition-all">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-th text-muted-foreground text-2xl"></i>
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">View All</h3>
                  <p className="text-xs text-muted-foreground">Categories</p>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Listings */}
        <section className="py-8 lg:py-12 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-2" data-testid="text-featured-title">
                  Featured Ads
                </h2>
                <p className="text-muted-foreground" data-testid="text-featured-description">
                  Premium listings from verified sellers
                </p>
              </div>
              <Link to="/featured" className="text-primary hover:text-primary/80 font-medium transition-colors" data-testid="link-view-all-featured">
                View All <ArrowRight className="w-4 h-4 ml-1 inline" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredListings.slice(0, 4).map((listing: any) => (
                <ListingCard 
                  key={listing._id} 
                  listing={listing} 
                  showFeaturedBadge={true}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Recent Ads */}
        <section className="py-8 lg:py-12 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-2" data-testid="text-recent-title">
                  Recent Ads
                </h2>
                <p className="text-muted-foreground" data-testid="text-recent-description">
                  Latest listings from your area
                </p>
              </div>
              <Link to="/listings" className="text-primary hover:text-primary/80 font-medium transition-colors" data-testid="link-view-all-recent">
                View All <ArrowRight className="w-4 h-4 ml-1 inline" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recentListings.map((listing: any) => (
                <ListingCard 
                  key={listing._id} 
                  listing={listing} 
                />
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Link to="/listings" data-testid="link-load-more">
                <Button variant="outline" className="px-8 py-3">
                  Load More
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
