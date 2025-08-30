import { Link } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { SearchBar } from './SearchBar';
import { UserDropdown } from './UserDropdown';
import { Button } from '@/components/ui/button';
import { Plus, Download } from 'lucide-react';

export function Header() {
  const { user } = useAuth();

  return (
    <header className="bg-primary shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" data-testid="link-home">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <i className="fas fa-bolt text-primary text-lg"></i>
                </div>
                <span className="text-white text-xl font-bold">Posttrr</span>
              </div>
            </Link>
          </div>
          
          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-4 lg:mx-8">
            <SearchBar />
          </div>
          
          {/* Location & Actions */}
          <div className="flex items-center space-x-4">
            {/* Location */}
            <div className="hidden md:flex items-center text-white/90 text-sm">
              <i className="fas fa-map-marker-alt mr-1"></i>
              <span data-testid="text-location">Rohtak, Haryana</span>
            </div>
            
            {/* PWA Install Button */}
            <Button 
              id="install-btn" 
              className="install-prompt bg-white/10 hover:bg-white/20 text-white border-none"
              data-testid="button-install-app"
            >
              <Download className="w-4 h-4 mr-1" />
              Install App
            </Button>
            
            {/* Post Ad Button */}
            <Link to="/post-ad" data-testid="link-post-ad">
              <Button className="bg-white text-primary hover:bg-white/90">
                <Plus className="w-4 h-4 mr-1" />
                Post Ad
              </Button>
            </Link>
            
            {/* User Menu */}
            {user ? (
              <UserDropdown />
            ) : (
              <Link to="/login" data-testid="link-login">
                <Button variant="ghost" className="text-white hover:text-white/80">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
      
      {/* Category Navigation */}
      <div className="bg-white border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-8 h-12 overflow-x-auto">
            <Link to="/category/cars" className="text-sm text-foreground hover:text-primary whitespace-nowrap transition-colors" data-testid="link-category-cars">
              Cars
            </Link>
            <Link to="/category/properties" className="text-sm text-foreground hover:text-primary whitespace-nowrap transition-colors" data-testid="link-category-properties">
              Properties
            </Link>
            <Link to="/category/mobiles" className="text-sm text-foreground hover:text-primary whitespace-nowrap transition-colors" data-testid="link-category-mobiles">
              Mobiles
            </Link>
            <Link to="/category/jobs" className="text-sm text-foreground hover:text-primary whitespace-nowrap transition-colors" data-testid="link-category-jobs">
              Jobs
            </Link>
            <Link to="/category/fashion" className="text-sm text-foreground hover:text-primary whitespace-nowrap transition-colors" data-testid="link-category-fashion">
              Fashion
            </Link>
            <Link to="/category/books-sports" className="text-sm text-foreground hover:text-primary whitespace-nowrap transition-colors" data-testid="link-category-books">
              Books, Sports & Hobbies
            </Link>
            <Link to="/category/bikes" className="text-sm text-foreground hover:text-primary whitespace-nowrap transition-colors" data-testid="link-category-bikes">
              Bikes
            </Link>
            <Link to="/category/electronics" className="text-sm text-foreground hover:text-primary whitespace-nowrap transition-colors" data-testid="link-category-electronics">
              Electronics & Appliances
            </Link>
            <Link to="/category/other" className="text-sm text-foreground hover:text-primary whitespace-nowrap transition-colors" data-testid="link-category-other">
              Other
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
