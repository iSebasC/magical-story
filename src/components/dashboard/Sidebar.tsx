'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  LogOut
} from 'lucide-react';
import { logout } from '@/lib/auth';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard
  },
  // Módulos comentados - no necesarios por ahora
  // {
  //   label: 'Historias',
  //   href: '/dashboard/stories',
  //   icon: BookOpen
  // },
  // {
  //   label: 'Usuarios',
  //   href: '/dashboard/users',
  //   icon: Users
  // },
  // {
  //   label: 'Configuración',
  //   href: '/dashboard/settings',
  //   icon: Settings
  // }
];

interface SidebarContentProps {
  pathname: string;
  onNavClick: () => void;
  onLogout: () => void;
}

function SidebarContent({ pathname, onNavClick, onLogout }: SidebarContentProps) {
  return (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-cream2">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-orange rounded-xl flex items-center justify-center text-xl shadow-[0_3px_0_#E05520]">
            📖
          </div>
          <span className="font-display text-xl font-bold text-ink">
            Magical <span className="text-orange">Story</span>
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavClick}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-orange text-white shadow-[0_2px_8px_rgba(255,107,53,0.2)]'
                  : 'text-inkm hover:bg-cream2 hover:text-ink'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-semibold text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-cream2">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-inkm hover:bg-red-50 hover:text-red-600 transition-all duration-200 w-full"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-semibold text-sm">Cerrar sesión</span>
        </button>
      </div>
    </>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const handleNavClick = () => {
    // No-op for now
  };

  return (
    <>
      {/* Desktop Sidebar - Solo visible en pantallas grandes */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r border-cream2 h-screen sticky top-0">
        <SidebarContent pathname={pathname} onNavClick={handleNavClick} onLogout={handleLogout} />
      </aside>
    </>
  );
}
