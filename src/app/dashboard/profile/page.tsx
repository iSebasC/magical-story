'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { PlanType } from '@/types/stories';
import { logout } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name?: string; email: string; createdAt?: string }>({ 
    name: '', 
    email: '', 
    createdAt: '' 
  });
  const [plan, setPlan] = useState<PlanType>('free');

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }
    };
    
    fetchUser();

    const storedPlan = localStorage.getItem('magicalstory_plan') as PlanType;
    if (storedPlan) {
      setPlan(storedPlan);
    }
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h2 className="font-display text-lg text-ink mb-0.5 tracking-wide">Profile & Settings</h2>
        <p className="text-sm text-inkm">Manage your account information</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-5 max-w-2xl">
        {/* Left: Profile Card */}
        <div className="bg-white rounded-2xl p-6 border border-cream2 text-center">
          <div className="w-24 h-24 rounded-full bg-orange/15 flex items-center justify-center text-4xl mx-auto mb-4">
            👤
          </div>
          <h3 className="font-display text-base text-ink mb-1 tracking-wide">{user.name}</h3>
          <p className="text-xs text-inkm mb-3">{user.email}</p>
          <span
            className={`inline-block text-[10px] font-bold px-2.5 py-1 rounded-full ${
              plan === 'premium'
                ? 'bg-orange/15 text-oranged'
                : 'bg-mint/25 text-green-700'
            }`}
          >
            {plan === 'premium' ? 'Premium ✨' : 'Free'}
          </span>
        </div>

        {/* Right: Account Details & Actions */}
        <div className="space-y-4">
          {/* Account Info */}
          <div className="bg-white rounded-2xl p-5 border border-cream2">
            <h4 className="font-display text-sm text-ink mb-3 tracking-wide">Account Information</h4>
            <div className="space-y-3">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-inkm mb-1">
                  Full Name
                </div>
                <div className="text-sm text-inks">{user.name}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-inkm mb-1">
                  Email Address
                </div>
                <div className="text-sm text-inks break-all">{user.email}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-inkm mb-1">
                  Member Since
                </div>
                <div className="text-sm text-inks">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'N/A'}
                </div>
              </div>
            </div>
          </div>

          {/* Plan Section */}
          <div className="bg-white rounded-2xl p-5 border border-cream2">
            <h4 className="font-display text-sm font-bold text-ink mb-3">
              {plan === 'premium' ? '✨ Premium plan' : '🌱 Free plan'}
            </h4>
            {plan === 'free' && (
              <div className="bg-cream rounded-xl p-4 mb-3">
                <p className="text-xs text-inks leading-relaxed mb-3">
                  Upgrade to Premium to unlock 150+ stories, audio narration, and weekly new releases!
                </p>
                <Link
                  href="/dashboard/plan"
                  className="block w-full py-2 rounded-lg text-xs font-bold text-white bg-orange hover:bg-oranged transition-colors text-center"
                >
                  ⭐ Upgrade to Premium
                </Link>
              </div>
            )}
            {plan === 'premium' && (
              <p className="text-xs text-inks leading-relaxed">
                You have access to the full library of 150+ stories, audio narration, and all future updates.
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="bg-white rounded-2xl p-5 border border-cream2">
            <h4 className="font-display text-sm font-bold text-ink mb-3">Account Actions</h4>
            <button
              onClick={handleLogout}
              className="w-full py-2.5 rounded-lg text-sm font-bold text-white bg-red-500 hover:bg-red-600 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
