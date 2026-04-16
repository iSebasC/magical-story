'use client';

import { Story } from '@/types/stories';
import { Lock } from 'lucide-react';

interface StoryCardProps {
  story: Story;
  isPremium: boolean;
  onCardClick: () => void;
}

export function StoryCard({ story, isPremium, onCardClick }: StoryCardProps) {
  const locked = !story.free && !isPremium;

  return (
    <div 
      onClick={onCardClick}
      className="bg-white rounded-2xl overflow-hidden border-[1.5px] border-cream2 hover:-translate-y-1 hover:shadow-lg hover:border-cream3 transition-all cursor-pointer relative group"
    >
      <div 
        className="h-32 flex items-center justify-center text-5xl relative"
        style={{ background: story.bg }}
      >
        <span className="relative z-10">{story.emoji}</span>
        {locked && (
          <div className="absolute inset-0 bg-ink/20 backdrop-blur-[2px] flex items-center justify-center">
            <Lock className="w-8 h-8 text-white" />
          </div>
        )}
      </div>
      <div className="p-3.5">
        <h3 className="font-display text-sm font-bold text-ink mb-1 leading-snug">
          {story.title}
        </h3>
        <div className="flex items-center gap-1.5">
          {story.free ? (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-mint/30 text-green-700">
              FREE
            </span>
          ) : (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange/20 text-oranged">
              PREMIUM
            </span>
          )}
          <span className="text-[10px] text-inkm">
            {story.pages.length} pages
          </span>
        </div>
      </div>
    </div>
  );
}
