'use client';

import React, { useEffect, useRef } from 'react';

export default function PricingSection() {
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

    const timer = setTimeout(() => {
      reveals.forEach((el) => el.classList.add('in'));
    }, 600);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-cream" id="pricing">
      <div className="max-w-6xl mx-auto px-7">
        <div className="text-center mb-14">
          <div className="reveal inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase text-oranged mb-3">
            <span className="w-4 h-0.5 bg-orange rounded"></span>Pricing
          </div>
          <h2 className="reveal delay-1 font-display text-4xl font-bold text-ink mb-4 leading-tight">Simple, honest pricing</h2>
          <p className="reveal delay-2 text-base text-inkm max-w-md mx-auto leading-relaxed">No hidden fees. Cancel any time. Start free.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-3xl mx-auto">

          {/* Free Access */}
          <div className="reveal delay-3 bg-white rounded-3xl p-8 border-2 border-cream2 relative hover:-translate-y-1.5 hover:shadow-xl transition-all">
            <div className="font-display text-lg font-medium tracking-wide mb-2">🌱 Free access</div>
            <div className="text-xs text-inkm mb-6">Try the platform, no strings</div>
            <div className="font-display text-5xl font-medium mb-2"><sup className="text-lg align-super">$</sup>0</div>
            <div className="text-xs text-inkm mb-7">Free forever</div>
            <ul className="space-y-2.5 mb-6">
              <li className="flex items-center gap-2 text-sm"><span className="w-5 h-5 rounded-full bg-teal/10 text-teald flex items-center justify-center text-[10px] font-bold flex-shrink-0">✓</span>1 story book with all resources</li>
            </ul>
            <a href="/login?tab=register" className="flex w-full items-center justify-center py-3 rounded-full text-sm font-medium text-inks border-2 border-cream2 hover:border-cream3 hover:bg-white transition-all">Get started free</a>
          </div>

          {/* School Access — featured */}
          <div className="reveal delay-4 bg-orange rounded-3xl p-8 border-2 border-orange relative md:scale-105 hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-sun text-ink text-[11px] font-medium px-3.5 py-1 rounded-full whitespace-nowrap">⭐ Most popular</div>
            <div className="font-display text-lg font-medium tracking-wide text-white mb-2">🏢 School access</div>
            <div className="text-xs text-white/70 mb-6">Everything for your classroom</div>
            <div className="font-display text-4xl font-medium text-white mb-2"><sup className="text-lg align-super">$</sup>75<span className="text-lg font-normal"> AUD</span></div>
            <div className="text-xs text-white/70 mb-7">per year · usually $120</div>
            <ul className="space-y-2.5 mb-6">
              <li className="flex items-center gap-2 text-sm text-white/80"><span className="w-5 h-5 rounded-full bg-white/20 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">✓</span>All storybooks</li>
              <li className="flex items-center gap-2 text-sm text-white/80"><span className="w-5 h-5 rounded-full bg-white/20 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">✓</span>All story audio recordings and chants</li>
              <li className="flex items-center gap-2 text-sm text-white/80"><span className="w-5 h-5 rounded-full bg-white/20 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">✓</span>All downloadable worksheets</li>
              <li className="flex items-center gap-2 text-sm text-white/80"><span className="w-5 h-5 rounded-full bg-white/20 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">✓</span>All printable discussion questions</li>
              <li className="flex items-center gap-2 text-sm text-white/80"><span className="w-5 h-5 rounded-full bg-white/20 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">✓</span>Classroom-friendly digital format for multiple users</li>
              <li className="flex items-center gap-2 text-sm text-white/80"><span className="w-5 h-5 rounded-full bg-white/20 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">✓</span>Ongoing updates and new content</li>
            </ul>
            <a href="/login" className="flex w-full items-center justify-center py-3 rounded-full text-sm font-medium text-orange bg-white hover:bg-sun transition-all">Get school access</a>
          </div>

          {/* Parent Access */}
          <div className="reveal delay-5 bg-white rounded-3xl p-8 border-2 border-cream2 relative hover:-translate-y-1.5 hover:shadow-xl transition-all">
            <div className="font-display text-lg font-medium tracking-wide mb-2">👨‍👩‍👧 Parent access</div>
            <div className="text-xs text-inkm mb-6">For families at home</div>
            <div className="font-display text-4xl font-medium mb-2"><sup className="text-lg align-super">$</sup>40<span className="text-lg font-normal"> AUD</span></div>
            <div className="text-xs text-inkm mb-7">per year · usually $60</div>
            <ul className="space-y-2.5 mb-6">
              <li className="flex items-center gap-2 text-sm"><span className="w-5 h-5 rounded-full bg-teal/10 text-teald flex items-center justify-center text-[10px] font-bold flex-shrink-0">✓</span>All storybooks</li>
              <li className="flex items-center gap-2 text-sm"><span className="w-5 h-5 rounded-full bg-teal/10 text-teald flex items-center justify-center text-[10px] font-bold flex-shrink-0">✓</span>All story audio recordings and chants</li>
              <li className="flex items-center gap-2 text-sm"><span className="w-5 h-5 rounded-full bg-teal/10 text-teald flex items-center justify-center text-[10px] font-bold flex-shrink-0">✓</span>Only one user</li>
            </ul>
            <a href="/login?tab=register" className="flex w-full items-center justify-center py-3 rounded-full text-sm font-medium text-white bg-teal hover:bg-teald transition-all">Get parent access</a>
          </div>

        </div>
      </div>
    </section>
  );
}
