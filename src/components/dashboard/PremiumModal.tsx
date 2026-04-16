'use client';

import { useRouter } from 'next/navigation';
import { Lock, Star, Check } from 'lucide-react';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PremiumModal({ isOpen, onClose }: PremiumModalProps) {
  const router = useRouter();

  const handleUpgrade = () => {
    onClose();
    router.push('/dashboard/plan');
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-ink/50 backdrop-blur-sm z-500 flex items-center justify-center p-5 opacity-100 transition-opacity"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl p-10 max-w-sm w-full text-center shadow-2xl transform transition-transform"
        onClick={(e) => e.stopPropagation()}
      >
        <Lock className="w-14 h-14 text-orange mx-auto mb-4" />
        <h2 className="font-display text-2xl font-bold text-ink mb-2">
          Premium story
        </h2>
        <p className="text-sm text-inkm mb-6 leading-relaxed">
          Upgrade to Premium to unlock this story and access the full library of 150+ titles.
        </p>
        <div className="flex flex-col gap-2 mb-6 text-left">
          <div className="flex items-center gap-2 text-xs text-inks">
            <Check className="w-3.5 h-3.5 text-mint" />
            <span>150+ premium stories</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-inks">
            <Check className="w-3.5 h-3.5 text-mint" />
            <span>Audio narration included</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-inks">
            <Check className="w-3.5 h-3.5 text-mint" />
            <span>New releases every week</span>
          </div>
        </div>
        <button 
          onClick={handleUpgrade}
          className="w-full py-3 rounded-full text-sm font-bold text-white bg-orange hover:bg-oranged shadow-[0_4px_14px_rgba(255,107,53,.35)] hover:-translate-y-0.5 transition-all mb-2"
        >
          <Star className="w-4 h-4 inline -mt-0.5" /> Upgrade to Premium
        </button>
        <button 
          onClick={onClose}
          className="text-sm text-inkm hover:text-ink transition-colors"
        >
          Maybe later
        </button>
      </div>
    </div>
  );
}
