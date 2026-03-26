import React from 'react';

/**
 * Trust Bar con estadísticas principales
 */
export const TrustBar: React.FC = () => {
  return (
    <div className="bg-white border-t border-b border-cream2 py-5">
      <div className="max-w-6xl mx-auto px-7">
        <div className="flex flex-wrap justify-around items-center gap-5">
          <div className="text-center">
            <div className="font-display text-2xl font-bold text-ink">120+</div>
            <div className="text-xs text-inkm mt-0.5">Schools worldwide</div>
          </div>
          <div className="hidden sm:block w-px h-8 bg-cream2"></div>
          <div className="text-center">
            <div className="font-display text-2xl font-bold text-ink">8,500</div>
            <div className="text-xs text-inkm mt-0.5">Active students</div>
          </div>
          <div className="hidden sm:block w-px h-8 bg-cream2"></div>
          <div className="text-center">
            <div className="font-display text-2xl font-bold text-ink">150+</div>
            <div className="text-xs text-inkm mt-0.5">Stories available</div>
          </div>
          <div className="hidden sm:block w-px h-8 bg-cream2"></div>
          <div className="text-center">
            <div className="font-display text-2xl font-bold text-ink">4.9 ★</div>
            <div className="text-xs text-inkm mt-0.5">Teacher rating</div>
          </div>
          <div className="hidden sm:block w-px h-8 bg-cream2"></div>
          <div className="text-center">
            <div className="font-display text-2xl font-bold text-ink">3×</div>
            <div className="text-xs text-inkm mt-0.5">More reading time</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustBar;
