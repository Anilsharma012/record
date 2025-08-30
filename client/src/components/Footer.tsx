import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <i className="fas fa-bolt text-primary text-lg"></i>
              </div>
              <span className="text-white text-xl font-bold" data-testid="text-footer-logo">Posttrr</span>
            </div>
            <p className="text-white/80 text-sm mb-6 leading-relaxed" data-testid="text-footer-description">
              Unleash the power of your passion. Share your unique creations, spark conversations, and find like-minded individuals. Posttrr is more than just a marketplace - it's a community where your content shines.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors" data-testid="link-social-facebook">
                <i className="fab fa-facebook text-sm"></i>
              </a>
              <a href="#" className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors" data-testid="link-social-twitter">
                <i className="fab fa-twitter text-sm"></i>
              </a>
              <a href="#" className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors" data-testid="link-social-instagram">
                <i className="fab fa-instagram text-sm"></i>
              </a>
              <a href="#" className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors" data-testid="link-social-linkedin">
                <i className="fab fa-linkedin text-sm"></i>
              </a>
            </div>
          </div>
          
          {/* Popular Locations */}
          <div>
            <h3 className="text-white font-semibold mb-4" data-testid="text-footer-locations-title">Popular Locations</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li><Link to="/location/kolkata" className="hover:text-white transition-colors" data-testid="link-location-kolkata">Kolkata</Link></li>
              <li><Link to="/location/mumbai" className="hover:text-white transition-colors" data-testid="link-location-mumbai">Mumbai</Link></li>
              <li><Link to="/location/chennai" className="hover:text-white transition-colors" data-testid="link-location-chennai">Chennai</Link></li>
              <li><Link to="/location/pune" className="hover:text-white transition-colors" data-testid="link-location-pune">Pune</Link></li>
              <li><Link to="/location/delhi" className="hover:text-white transition-colors" data-testid="link-location-delhi">Delhi</Link></li>
              <li><Link to="/location/bangalore" className="hover:text-white transition-colors" data-testid="link-location-bangalore">Bangalore</Link></li>
            </ul>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4" data-testid="text-footer-quicklinks-title">Quick Links</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li><Link to="/about" className="hover:text-white transition-colors" data-testid="link-about">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors" data-testid="link-contact">Contact Us</Link></li>
              <li><Link to="/subscription" className="hover:text-white transition-colors" data-testid="link-footer-subscription">Subscription</Link></li>
              <li><Link to="/blog" className="hover:text-white transition-colors" data-testid="link-blog">Our Blog</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors" data-testid="link-faq">FAQs</Link></li>
              <li><Link to="/careers" className="hover:text-white transition-colors" data-testid="link-careers">Careers</Link></li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4" data-testid="text-footer-support-title">Posttrr</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li><Link to="/blog" className="hover:text-white transition-colors" data-testid="link-footer-blog">Blog</Link></li>
              <li><Link to="/help" className="hover:text-white transition-colors" data-testid="link-help">Help</Link></li>
              <li><Link to="/sitemap" className="hover:text-white transition-colors" data-testid="link-sitemap">Sitemap</Link></li>
              <li><Link to="/legal" className="hover:text-white transition-colors" data-testid="link-legal">Legal & Privacy Information</Link></li>
              <li><Link to="/vulnerability" className="hover:text-white transition-colors" data-testid="link-vulnerability">Vulnerability Disclosure Program</Link></li>
              <li><Link to="/mobile-app" className="hover:text-white transition-colors" data-testid="link-mobile-app">Mobile App</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-white/80 text-sm" data-testid="text-footer-copyright">
            All rights reserved © 2006-2025 Posttrr
          </p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-white/80 hover:text-white text-sm transition-colors" data-testid="link-privacy">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-white/80 hover:text-white text-sm transition-colors" data-testid="link-terms">
              Terms of Service
            </Link>
            <Button 
              id="footer-install-btn" 
              className="install-prompt bg-white/10 hover:bg-white/20 text-white border-none"
              data-testid="button-footer-install-app"
            >
              <Download className="w-4 h-4 mr-1" />
              Install App
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
