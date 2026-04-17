'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { logout } from '@/lib/auth';
import { PlanType } from '@/types/stories';
import { Home, Library, User, LogOut, type LucideIcon } from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  {
    label: 'Home',
    href: '/dashboard',
    icon: Home
  },
  {
    label: 'Library',
    href: '/dashboard/library',
    icon: Library
  },
  // {
  //   label: 'My Plan',
  //   href: '/dashboard/plan',
  //   icon: CreditCard
  // },
  {
    label: 'Profile',
    href: '/dashboard/profile',
    icon: User
  }
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [plan, setPlan] = useState<PlanType>('free');

  useEffect(() => {
    const storedPlan = localStorage.getItem('magicalstory_plan') as PlanType;
    if (storedPlan) {
      setPlan(storedPlan);
    }
  }, []);

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  return (
    <>
      {/* Sidebar overlay (mobile) */}
      <div 
        className={`fixed inset-0 bg-ink/35 z-10 transition-opacity lg:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside 
        className={`w-60 min-h-screen bg-linear-to-b from-[#E8F4FD] via-[#EEF2FF] to-[#F0F0FF] fixed top-0 left-0 bottom-0 z-20 flex flex-col transition-transform duration-300 border-r border-blue-100/60 ${
          isOpen ? 'translate-x-0' : '-translate-x-60'
        } lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-blue-100/60">
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
        <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-all ${
                  isActive
                    ? 'bg-orange/15 text-orange font-semibold'
                    : 'text-inkm hover:bg-white/60'
                }`}
              >
                <Icon className="w-[18px] h-[18px] flex-shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Plan box */}
        <div className="mx-3 mb-4 p-3.5 bg-white/40 border border-blue-100 rounded-xl">
          <div className="text-[10px] font-bold uppercase tracking-wider text-inkm mb-1">
            Current plan
          </div>
          <div className="font-display text-sm font-semibold text-ink mb-2">
            {plan === 'premium' ? (
              <>
                Premium{' '}
                <span className="ml-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange/20 text-orange">
                  PRO
                </span>
              </>
            ) : (
              <>
                Free{' '}
                <span className="ml-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-sun/30 text-yellow-700">
                  FREE
                </span>
              </>
            )}
          </div>
          {/* {plan === 'free' && (
            <Link
              href="/dashboard/plan"
              className="block w-full py-2 rounded-lg text-xs font-bold text-white bg-orange hover:bg-oranged transition-colors text-center"
            >
              ⭐ Upgrade to Premium
            </Link>
          )} */}
        </div>

        {/* Logout Button */}
        <div className="mx-3 mb-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-[18px] h-[18px] flex-shrink-0" />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
