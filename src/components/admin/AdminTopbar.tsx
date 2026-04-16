'use client';

import { usePathname } from 'next/navigation';
import { Menu, Bell, Search } from 'lucide-react';

const PAGE_TITLES: Record<string, string> = {
  '/admin/overview': 'Overview',
  '/admin/stories': 'Stories',
  '/admin/users': 'Users',
  '/admin/settings': 'Settings',
};

export function AdminTopbar() {
  const pathname = usePathname();
  const pageTitle = PAGE_TITLES[pathname] || 'Admin';

  const handleMobileMenu = () => {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sbOverlay');
    
    if (sidebar && overlay) {
      sidebar.classList.remove('-translate-x-56');
      overlay.classList.remove('opacity-0', 'pointer-events-none');
      document.body.style.overflow = 'hidden';
    }
  };

  return (
    <div className="h-[60px] bg-white border-b border-cream2 flex items-center justify-between px-5 lg:px-7 sticky top-0 z-10 flex-shrink-0">
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <button
          id="mobHam"
          onClick={handleMobileMenu}
          className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl border border-cream2 hover:bg-cream transition-colors"
        >
          <Menu className="w-4 h-4 text-ink" />
        </button>

        <div>
          <h1 className="font-display text-lg font-bold text-ink" id="topbarTitle">
            {pageTitle}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="w-9 h-9 flex items-center justify-center rounded-xl border border-cream2 hover:bg-cream transition-colors">
          <Search className="w-4 h-4 text-inkm" />
        </button>
        <button className="w-9 h-9 flex items-center justify-center rounded-xl border border-cream2 hover:bg-cream transition-colors relative">
          <Bell className="w-4 h-4 text-inkm" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange rounded-full"></span>
        </button>
      </div>
    </div>
  );
}
