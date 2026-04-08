'use client';

import React, { useEffect, useRef } from 'react';

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reveals = section.querySelectorAll('.reveal');
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '-50px' }
    );

    reveals.forEach((el) => observer.observe(el));

    // Fallback timer
    const timer = setTimeout(() => {
      reveals.forEach((el) => el.classList.add('in'));
    }, 600);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-cream" id="features">
      <div className="max-w-6xl mx-auto px-7">
        <div className="mb-14">
          <div className="reveal inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase text-oranged mb-3">
            <span className="w-4 h-0.5 bg-orange rounded"></span>Features
          </div>
          <h2 className="reveal delay-1 font-display text-4xl font-bold text-ink mb-3">
            Everything in <em className="font-normal" style={{ fontStyle: 'italic', color: '#FF6B35' }}>one place</em>
          </h2>
          <p className="reveal delay-2 text-base text-inkm max-w-lg leading-relaxed">
            Designed for the child's joy and the teacher's peace of mind.
          </p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
          
          {/* bc-1 span 5 */}
          <div className="reveal delay-3 lg:col-span-5 bg-white rounded-2xl p-7 border-[1.5px] border-cream2 hover:shadow-lg hover:-translate-y-1 hover:border-cream3 transition-all">
            <div className="w-12 h-12 rounded-xl bg-orange/10 flex items-center justify-center text-2xl mb-4">📖</div>
            <h3 className="font-display text-lg font-medium tracking-wide mb-2">Page-by-page reading</h3>
            <p className="text-sm text-inkm leading-relaxed">
              Each story works like a real book — children turn pages, follow illustrations, and get absorbed in the world at their own pace.
            </p>
          </div>

          {/* bc-2 span 7 — dashboard with progress bars */}
          <div className="reveal delay-4 lg:col-span-7 bg-white rounded-2xl p-7 border-[1.5px] border-cream2 hover:shadow-lg hover:-translate-y-1 hover:border-cream3 transition-all grid md:grid-cols-2 gap-6 items-center">
            <div>
              <div className="w-12 h-12 rounded-xl bg-teal/10 flex items-center justify-center text-2xl mb-4">📊</div>
              <h3 className="font-display text-lg font-medium tracking-wide mb-2">Live classroom dashboard</h3>
              <p className="text-sm text-inkm leading-relaxed">
                See who's reading, how far they've gone, and who needs encouragement — without interrupting the class.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2.5 bg-cream rounded-xl px-3 py-2.5 text-sm font-semibold">
                <span className="min-w-[56px] text-inks text-xs">Sofia R.</span>
                <div className="flex-1 h-1.5 bg-cream2 rounded-full overflow-hidden">
                  <div className="h-full bg-teal rounded-full" style={{ width: '82%' }}></div>
                </div>
                <span className="text-xs text-teald">82%</span>
              </div>
              <div className="flex items-center gap-2.5 bg-cream rounded-xl px-3 py-2.5 text-sm font-semibold">
                <span className="min-w-[56px] text-inks text-xs">Marco L.</span>
                <div className="flex-1 h-1.5 bg-cream2 rounded-full overflow-hidden">
                  <div className="h-full bg-teal rounded-full" style={{ width: '55%' }}></div>
                </div>
                <span className="text-xs text-teald">55%</span>
              </div>
              <div className="flex items-center gap-2.5 bg-cream rounded-xl px-3 py-2.5 text-sm font-semibold">
                <span className="min-w-[56px] text-inks text-xs">Ana P.</span>
                <div className="flex-1 h-1.5 bg-cream2 rounded-full overflow-hidden">
                  <div className="h-full bg-teal rounded-full" style={{ width: '100%' }}></div>
                </div>
                <span className="text-xs text-teald">✓</span>
              </div>
              <div className="flex items-center gap-2.5 bg-cream rounded-xl px-3 py-2.5 text-sm font-semibold">
                <span className="min-w-[56px] text-inks text-xs">Diego F.</span>
                <div className="flex-1 h-1.5 bg-cream2 rounded-full overflow-hidden">
                  <div className="h-full bg-orange rounded-full" style={{ width: '30%' }}></div>
                </div>
                <span className="text-xs text-orange">30%</span>
              </div>
            </div>
          </div>

          {/* bc-3 span 4 */}
          <div className="reveal delay-5 lg:col-span-4 bg-white rounded-2xl p-7 border-[1.5px] border-cream2 hover:shadow-lg hover:-translate-y-1 hover:border-cream3 transition-all">
            <div className="w-12 h-12 rounded-xl bg-plum/10 flex items-center justify-center text-2xl mb-4">🎙️</div>
            <h3 className="font-display text-lg font-medium tracking-wide mb-2">Professional audio narration</h3>
            <p className="text-sm text-inkm leading-relaxed">
              Expressive voice acting on every page. Perfect for early readers or quiet listening time.
            </p>
          </div>

          {/* bc-4 span 4 */}
          <div className="reveal delay-6 lg:col-span-4 bg-white rounded-2xl p-7 border-[1.5px] border-cream2 hover:shadow-lg hover:-translate-y-1 hover:border-cream3 transition-all">
            <div className="w-12 h-12 rounded-xl bg-sun/30 flex items-center justify-center text-2xl mb-4">🎯</div>
            <h3 className="font-display text-lg font-medium tracking-wide mb-2">Story of the day</h3>
            <p className="text-sm text-inkm leading-relaxed">
              Schedule the class story for the whole week in one click. Students see it automatically.
            </p>
          </div>

          {/* bc-5 span 4 */}
          <div className="reveal delay-7 lg:col-span-4 bg-white rounded-2xl p-7 border-[1.5px] border-cream2 hover:shadow-lg hover:-translate-y-1 hover:border-cream3 transition-all">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-2xl mb-4">🛡️</div>
            <h3 className="font-display text-lg font-medium tracking-wide mb-2">Safe for children</h3>
            <p className="text-sm text-inkm leading-relaxed">
              No ads, no social features, no external links. A closed, safe environment for learning.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
