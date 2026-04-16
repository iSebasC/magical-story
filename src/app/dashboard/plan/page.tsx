'use client';

import { useEffect, useState } from 'react';
import { PlanType } from '@/types/stories';
import { Sprout, Star, Check, X as XIcon, Info } from 'lucide-react';

export default function PlanPage() {
  const [plan, setPlan] = useState<PlanType>('free');

  useEffect(() => {
    const storedPlan = localStorage.getItem('magicalstory_plan') as PlanType;
    if (storedPlan) {
      setPlan(storedPlan);
    }
  }, []);

  const handleUpgrade = () => {
    localStorage.setItem('magicalstory_plan', 'premium');
    setPlan('premium');
    
    // Refresh para actualizar el sidebar
    window.location.reload();
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h2 className="font-display text-xl font-bold text-ink mb-0.5">Choose your plan</h2>
        <p className="text-sm text-inkm">Unlock the magic of storytelling</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-xl">
        {/* Free Plan */}
        <div className="bg-white rounded-2xl p-6 border-2 border-cream2 hover:border-cream3 hover:shadow-lg transition-all">
          <div className="text-center mb-4">
            <Sprout className="w-10 h-10 text-mint mx-auto mb-2" />
            <h3 className="font-display text-2xl font-bold text-ink mb-1">Free</h3>
            <div className="text-3xl font-display font-bold text-inks mb-1">
              $0<span className="text-base font-medium text-inkm">/month</span>
            </div>
            <p className="text-xs text-inkm">Perfect to get started</p>
          </div>
          <div className="space-y-2.5 mb-5">
            <div className="flex items-center gap-2 text-sm text-inks">
              <Check className="w-3.5 h-3.5 text-mint" />
              <span>5 free stories</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-inks">
              <Check className="w-3.5 h-3.5 text-mint" />
              <span>Basic narration</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-inks">
              <XIcon className="w-3.5 h-3.5 text-cream3" />
              <span className="text-inkm">Premium library</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-inks">
              <XIcon className="w-3.5 h-3.5 text-cream3" />
              <span className="text-inkm">New releases</span>
            </div>
          </div>
          {plan === 'free' && (
            <div className="px-4 py-2.5 rounded-lg text-sm font-bold text-center bg-cream2 text-inks">
              Currently active
            </div>
          )}
        </div>

        {/* Premium Plan */}
        <div className="bg-linear-to-b from-orange to-oranged rounded-2xl p-6 text-white shadow-[0_8px_24px_rgba(255,107,53,.3)] border-2 border-orange/20 hover:shadow-[0_12px_32px_rgba(255,107,53,.4)] transition-all">
          <div className="text-center mb-4">
            <Star className="w-10 h-10 text-white mx-auto mb-2" />
            <h3 className="font-display text-2xl font-bold mb-1">Premium</h3>
            <div className="text-3xl font-display font-bold mb-1">
              $9.99<span className="text-base font-medium">/month</span>
            </div>
            <p className="text-xs text-white/80">Unlimited magic stories</p>
          </div>
          <div className="space-y-2.5 mb-5">
            <div className="flex items-center gap-2 text-sm">
              <Check className="w-3.5 h-3.5" />
              <span>150+ premium stories</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Check className="w-3.5 h-3.5" />
              <span>Audio narration included</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Check className="w-3.5 h-3.5" />
              <span>New releases every week</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Check className="w-3.5 h-3.5" />
              <span>Ad-free experience</span>
            </div>
          </div>
          {plan === 'premium' ? (
            <div className="px-4 py-2.5 rounded-lg text-sm font-bold text-center bg-white/20 text-white">
              <Check className="w-3.5 h-3.5 inline -mt-0.5" /> You&apos;re on Premium!
            </div>
          ) : (
            <button
              onClick={handleUpgrade}
              className="w-full px-4 py-2.5 rounded-lg text-sm font-bold bg-white text-orange hover:bg-white/90 transition-colors"
            >
              Upgrade to Premium
            </button>
          )}
        </div>
      </div>

      <p className="mt-5 text-xs text-inkm max-w-sm leading-relaxed flex items-center gap-1.5">
        <Info className="w-3.5 h-3.5 flex-shrink-0" /> No payments are processed right now — this is a preview. Billing will be enabled in a future update.
      </p>
    </div>
  );
}
