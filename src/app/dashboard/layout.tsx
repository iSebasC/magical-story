'use client';

import { Sidebar } from '@/components/dashboard/Sidebar';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

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
          <p className="text-inkm font-semibold">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-cream overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-8">
          {/* Contenido */}
          {children}
        </div>
      </main>
    </div>
  );
}
