'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import { Sidebar, Topbar } from '@/components/dashboard';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Home',
  '/dashboard/library': 'Library',
  // '/dashboard/plan': 'My Plan',
  '/dashboard/profile': 'Profile'
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Verificar autenticación
    const checkAuth = () => {
      if (!isAuthenticated()) {
        router.push('/login');
        return;
      }

      setLoading(false);
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-cream">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange border-t-transparent rounded-full animate-spin" />
          <p className="text-inkm font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  const pageTitle = PAGE_TITLES[pathname] || 'Dashboard';

  return (
    <div className="bg-cream text-ink flex min-h-screen">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col min-h-screen lg:ml-60">
        <Topbar title={pageTitle} onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
