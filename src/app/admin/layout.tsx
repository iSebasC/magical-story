'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import { getCurrentUser } from '@/lib/auth';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAdmin = async () => {
      const user = await getCurrentUser();
      console.log('🔐 ADMIN LAYOUT - User:', user);
      console.log('🔐 ADMIN LAYOUT - Role:', user?.role);
      
      if (!user) {
        console.log('❌ No user, redirect to /login');
        router.push('/login');
        return;
      }
      
      if (user.role !== 'admin') {
        console.log('❌ Not admin, redirect to /dashboard');
        router.push('/dashboard');
        return;
      }
      
      console.log('✅ Is admin, show layout');
      setIsAdmin(true);
    };

    checkAdmin();
  }, [router]);

  // Mientras verifica, mostrar loading
  if (isAdmin === null) {
    return (
      <div className="bg-[#F1EFF8] text-ink flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-lg font-fraunces">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  // Si no es admin, no mostrar nada (ya está redirigiendo)
  if (!isAdmin) {
    return null;
  }

  return (
    <div className="bg-[#F1EFF8] text-ink flex min-h-screen">
      {/* Sidebar */}
      <AdminSidebar />
      
      {/* Overlay for mobile */}
      <div 
        id="sbOverlay"
        onClick={() => {
          const sidebar = document.getElementById('sidebar');
          const overlay = document.getElementById('sbOverlay');
          if (sidebar && overlay) {
            sidebar.classList.add('-translate-x-56');
            overlay.classList.add('opacity-0', 'pointer-events-none');
            document.body.style.overflow = '';
          }
        }}
        className="fixed inset-0 bg-sidebar/50 z-10 opacity-0 pointer-events-none transition-opacity lg:hidden"
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-56">
        <AdminTopbar />
        
        {/* Page Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
