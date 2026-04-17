'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import { LayoutDashboard, BookOpen, Users, Settings, LogOut, type LucideIcon } from 'lucide-react';
import { logout } from '@/lib/auth';

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  path: string;
}

const mainNavItems: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, path: '/admin/overview' },
  { id: 'stories', label: 'Stories', icon: BookOpen, path: '/admin/stories' },
  { id: 'users', label: 'Users', icon: Users, path: '/admin/users' },
];

const configNavItems: NavItem[] = [
  { id: 'settings', label: 'Settings', icon: Settings, path: '/admin/settings' },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  const handleNavClick = (path: string) => {
    router.push(path);
    setIsMobileOpen(false);
  };

  return (
    <aside 
      id="sidebar" 
      className="w-56 min-h-screen bg-sidebar fixed top-0 left-0 bottom-0 z-20 flex flex-col transition-transform duration-300 lg:translate-x-0 -translate-x-56"
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-white/8">
        <Image 
          src="/images/logo-sel-story-lessons.png" 
          alt="SEL Story Lessons Logo" 
          width={140} 
          height={42}
          quality={100}
          priority
          className="h-7 w-auto object-contain"
        />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4">
        {/* Main Section */}
        <div className="text-[10px] font-bold uppercase tracking-widest text-white/30 px-3 mb-2">
          Main
        </div>
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              onClick={() => handleNavClick(item.path)}
              className={`
                ni flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium cursor-pointer mb-0.5 transition-all
                ${isActive(item.path) 
                  ? 'bg-orange/15 text-orange font-semibold' 
                  : 'text-white/70 hover:bg-white/8'
                }
              `}
            >
              <Icon className="w-[18px] h-[18px] flex-shrink-0" /> {item.label}
            </div>
          );
        })}

        {/* Config Section */}
        <div className="text-[10px] font-bold uppercase tracking-widest text-white/30 px-3 mb-2 mt-4">
          Config
        </div>
        {configNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              onClick={() => handleNavClick(item.path)}
              className={`
                ni flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium cursor-pointer mb-0.5 transition-all
                ${isActive(item.path) 
                  ? 'bg-orange/15 text-orange font-semibold' 
                  : 'text-white/70 hover:bg-white/8'
                }
              `}
            >
              <Icon className="w-[18px] h-[18px] flex-shrink-0" /> {item.label}
            </div>
          );
        })}
      </nav>

      {/* Admin Info */}
      <div className="mx-3 mb-2 p-3.5 bg-white/6 rounded-xl border border-white/8 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-orange flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
          A
        </div>
        <div className="overflow-hidden">
          <div className="text-xs font-semibold text-white truncate">Admin</div>
          <div className="text-[10px] text-white/50 truncate">admin@magical.com</div>
        </div>
      </div>

      {/* Logout Button */}
      <div className="mx-3 mb-4">
        <button
          onClick={async () => { await logout(); window.location.href = '/login'; }}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-white/8 transition-all cursor-pointer"
        >
          <LogOut className="w-[18px] h-[18px] flex-shrink-0" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
