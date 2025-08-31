import { Plus } from 'lucide-react';

export default function Fab() {
  return (
    <a href="/post-ad" className="fab md:hidden" aria-label="Post Ad">
      <Plus className="w-6 h-6" />
    </a>
  );
}
