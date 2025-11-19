import { Link, useLocation } from 'wouter';
import { Home, MessageCircle, FolderOpen, User } from 'lucide-react';

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
    <nav className="bottom-nav md:hidden">
      <div className="flex items-center">
        <Item to="/" icon={Home} label="Home" />
        <Item to="/chat" icon={MessageCircle} label="Chat" />
        <Item to="/my-ads" icon={FolderOpen} label="My Ads" />
        <Item to="/profile" icon={User} label="Profile" />
      </div>
    </nav>
  );
}
