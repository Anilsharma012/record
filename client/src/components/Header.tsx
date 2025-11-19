import { useAuth } from '@/contexts/AuthContext';
import { SearchBar } from './SearchBar';
import { UserDropdown } from './UserDropdown';
import { Button } from '@/components/ui/button';
import { Heart, Bell, MapPin } from 'lucide-react';
import { Link } from 'wouter';
export function Header() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50">
      {/* Mobile header */}
      <div className="md:hidden bg-primary">
        <div className="px-3 h-14 flex items-center justify-between">
          <Link to="/" className="text-white font-extrabold tracking-tight text-xl">POSTTRR</Link>
          <div className="flex items-center gap-4 text-white">
            <MapPin className="w-5 h-5" />
            <Heart className="w-5 h-5" />
            <Bell className="w-5 h-5" />
          </div>
        </div>
        <div className="search-row pb-3">
          <input className="h-11 px-3 rounded-[10px] border border-[#E9E9E9] text-sm" placeholder="Search 'Mobiles'" />
          <button className="icon-btn">
            <Heart className="w-5 h-5 text-gray-700" />
          </button>
          <button className="icon-btn">
            <Bell className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Desktop header */}
      <div className="hidden md:block bg-primary shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[68px]">
            <div className="flex items-center">
              <Link to="/" data-testid="link-home">
                <div className="flex items-center space-x-2">
                  <div className="w-9 h-9 bg-white rounded-md flex items-center justify-center">
                    <i className="fas fa-bolt text-primary text-lg"></i>
                  </div>
                  <span className="text-white text-2xl font-bold tracking-tight">POSTTRR</span>
                </div>
              </Link>
            </div>
            <div className="flex-1 max-w-3xl mx-4 lg:mx-8">
              <SearchBar />
            </div>
            <div className="flex items-center space-x-3">
              <div className="hidden md:flex items-center text-white/95 text-sm bg-white/10 hover:bg-white/15 px-3 h-10 rounded-full">
                <i className="fas fa-map-marker-alt mr-2"></i>
                <span className="max-w-[140px] truncate" data-testid="text-location">Budha Khera, Rohtak</span>
              </div>
              <Link to="/post-ad" data-testid="link-post-ad">
                <Button className="h-10 px-4 rounded-full bg-transparent border border-white text-white hover:bg-white/10">
                  Ad Listing
                </Button>
              </Link>
              <div className="hidden md:flex items-center h-10 px-3 rounded-full bg-white/10 text-white text-sm">
                <span className="mr-2">🌐</span>
                en
              </div>
              {user ? (
                <UserDropdown />
              ) : (
                <Link to="/login" data-testid="link-login">
                  <Button variant="ghost" className="h-10 px-3 text-white hover:text-white/80 rounded-full">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
        <div className="bg-white border-t border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative flex items-center space-x-8 h-12 overflow-x-auto">
              <Link to="/category/cars" className="text-sm text-foreground hover:text-primary whitespace-nowrap transition-colors" data-testid="link-category-cars">Cars</Link>
              <Link to="/category/properties" className="text-sm text-foreground hover:text-primary whitespace-nowrap transition-colors" data-testid="link-category-properties">Properties</Link>
              <Link to="/category/mobiles" className="text-sm text-foreground hover:text-primary whitespace-nowrap transition-colors" data-testid="link-category-mobiles">Mobiles</Link>
              <Link to="/category/jobs" className="text-sm text-foreground hover:text-primary whitespace-nowrap transition-colors" data-testid="link-category-jobs">Jobs</Link>
              <Link to="/category/fashion" className="text-sm text-foreground hover:text-primary whitespace-nowrap transition-colors" data-testid="link-category-fashion">Fashion</Link>
              <Link to="/category/books-sports" className="text-sm text-foreground hover:text-primary whitespace-nowrap transition-colors" data-testid="link-category-books">Books, Sports & Hobbies</Link>
              <Link to="/category/bikes" className="text-sm text-foreground hover:text-primary whitespace-nowrap transition-colors" data-testid="link-category-bikes">Bikes</Link>
              <Link to="/category/electronics" className="text-sm text-foreground hover:text-primary whitespace-nowrap transition-colors" data-testid="link-category-electronics">Electronics & Appliances</Link>
              <div className="group relative">
                <button className="text-sm text-foreground hover:text-primary whitespace-nowrap transition-colors">Other ▾</button>
                <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity absolute left-0 top-full mt-2 w-[920px] bg-white border border-border rounded-lg shadow-lg p-6 z-40">
                  <div className="grid grid-cols-4 gap-8 text-sm">
                    <div>
                      <h4 className="font-semibold mb-2">Commercial Vehicles & Spares</h4>
                      <ul className="space-y-1 text-foreground/80">
                        <li><Link to="/category/commercial">Commercial & Other Vehicles</Link></li>
                        <li><Link to="/category/spares">Spare Parts</Link></li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Furniture</h4>
                      <ul className="space-y-1 text-foreground/80">
                        <li><Link to="/category/furniture">Sofa & Dining</Link></li>
                        <li><Link to="/category/furniture">Beds & Wardrobes</Link></li>
                        <li><Link to="/category/furniture">Home Decor & Garden</Link></li>
                        <li><Link to="/category/furniture">Kids Furniture</Link></li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Pets</h4>
                      <ul className="space-y-1 text-foreground/80">
                        <li><Link to="/category/pets">Fish & Aquarium</Link></li>
                        <li><Link to="/category/pets">Pet Food & Accessories</Link></li>
                        <li><Link to="/category/pets">Dogs</Link></li>
                        <li><Link to="/category/pets">Other Pets</Link></li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Services</h4>
                      <ul className="space-y-1 text-foreground/80">
                        <li><Link to="/services/education">Education & Classes</Link></li>
                        <li><Link to="/services/tours">Tours & Travel</Link></li>
                        <li><Link to="/services/repair">Electronics Repair & Services</Link></li>
                        <li><Link to="/services/health">Health & Beauty</Link></li>
                        <li><Link to="/services/renovation">Home Renovation & Repair</Link></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
