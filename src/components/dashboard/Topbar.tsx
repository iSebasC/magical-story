'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu, User } from 'lucide-react';

interface TopbarProps {
  title: string;
  onMenuClick: () => void;
}

export function Topbar({ title, onMenuClick }: TopbarProps) {
  const [userName, setUserName] = useState('User');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('magicalstory_auth_user') || '{}');
    if (user.name) {
      setUserName(user.name.split(' ')[0]);
    }
  }, []);

  return (
    <div 
      className="h-15 bg-white border-b border-cream2 flex items-center justify-between px-5 lg:px-8 sticky top-0 z-10" 
      style={{ height: '60px' }}
    >
      <div className="flex items-center gap-3">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-1"
        >
          <Menu className="w-5 h-5 text-ink" />
        </button>
        <span className="font-display text-base font-semibold text-ink">{title}</span>
      </div>
      <div className="flex items-center gap-2.5">
        <span className="text-sm font-medium text-inks hidden sm:block">{userName}</span>
        <Link 
          href="/dashboard/profile"
          className="w-9 h-9 rounded-full bg-cream2 border-2 border-cream3 flex items-center justify-center text-base cursor-pointer hover:border-orange transition-colors"
        >
          <User className="w-4 h-4 text-inkm" />
        </Link>
      </div>
    </div>
  );
}
