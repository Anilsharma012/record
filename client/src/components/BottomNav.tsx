import { Link, useLocation } from 'wouter';
import { Home, MessageCircle, Plus, FolderOpen, User } from 'lucide-react';

export default function BottomNav() {
  const [location] = useLocation();
  const Item = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => (
    <Link href={to}>
      <a className={`flex flex-col items-center justify-center flex-1 py-2 text-xs ${location === to ? 'text-[var(--primary)]' : 'text-gray-600'}`}>
        <Icon className="w-5 h-5 mb-1" />
        {label}
      </a>
    </Link>
  );

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-border shadow-sm md:hidden">
      <div className="flex items-center">
        <Item to="/" icon={Home} label="Home" />
        <Item to="/chat" icon={MessageCircle} label="Chat" />
        <div className="relative -mt-6 flex-1 flex justify-center">
          <Link href="/post-ad">
            <a className="w-12 h-12 rounded-full bg-[var(--primary)] text-white flex items-center justify-center shadow-lg">
              <Plus className="w-6 h-6" />
            </a>
          </Link>
        </div>
        <Item to="/my-ads" icon={FolderOpen} label="My Ads" />
        <Item to="/profile" icon={User} label="Profile" />
      </div>
    </nav>
  );
}
