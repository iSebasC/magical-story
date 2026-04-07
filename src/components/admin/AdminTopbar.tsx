'use client';

import { usePathname } from 'next/navigation';

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
          <div className="space-y-1.5">
            <div className="w-4 h-0.5 bg-ink rounded"></div>
            <div className="w-4 h-0.5 bg-ink rounded"></div>
            <div className="w-4 h-0.5 bg-ink rounded"></div>
          </div>
        </button>

        <div>
          <h1 className="font-display text-lg font-bold text-ink" id="topbarTitle">
            {pageTitle}
          </h1>
        </div>
      </div>
    </div>
  );
}
