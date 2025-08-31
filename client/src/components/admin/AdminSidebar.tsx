import { Link, useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings, 
  Tag, 
  MapPin, 
  Flag, 
  Bell, 
  BarChart,
  LogOut,
  Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const sidebarItems = [
  {
    title: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard
  },
  {
    title: 'Ads Management',
    href: '/admin/ads',
    icon: FileText
  },
  {
    title: 'Users Management',
    href: '/admin/users',
    icon: Users
  },
  {
    title: 'Categories',
    href: '/admin/categories',
    icon: Tag
  },
  {
    title: 'Locations',
    href: '/admin/locations',
    icon: MapPin
  },
  {
    title: 'Reports',
    href: '/admin/reports',
    icon: Flag
  },
  {
    title: 'Packages & Pricing',
    href: '/admin/packages',
    icon: Tag
  },
  {
    title: 'Pricing Rules',
    href: '/admin/pricing',
    icon: Tag
  },
  {
    title: 'Notifications',
    href: '/admin/notifications',
    icon: Bell
  },
  {
    title: 'Promotions',
    href: '/admin/promotions',
    icon: Tag
  },
  {
    title: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings
  },
  {
    title: 'Pages',
    href: '/admin/pages',
    icon: FileText
  },
  {
    title: 'Banners',
    href: '/admin/banners',
    icon: Home
  }
];

export function AdminSidebar() {
  const [location] = useLocation();
  const { logout } = useAuth();

  return (
    <div className="w-64 bg-white border-r border-border h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link to="/" className="flex items-center space-x-2" data-testid="link-admin-home">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <i className="fas fa-bolt text-white text-lg"></i>
          </div>
          <div>
            <span className="text-primary text-xl font-bold">Posttrr</span>
            <div className="text-xs text-muted-foreground">Admin Panel</div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;
          
          return (
            <Link key={item.href} to={item.href} data-testid={`link-admin-${item.title.toLowerCase().replace(/\s+/g, '-')}`}>
              <div className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors cursor-pointer",
                isActive 
                  ? "bg-primary text-white" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}>
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.title}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-border space-y-2">
        <Link to="/" data-testid="link-view-site">
          <Button variant="outline" className="w-full justify-start">
            <Home className="w-4 h-4 mr-2" />
            View Site
          </Button>
        </Link>
        
        <Button 
          variant="ghost" 
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={logout}
          data-testid="button-admin-logout"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
