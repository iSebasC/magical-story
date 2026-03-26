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
          }
        });
      },
      { threshold: 0.1 }
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
        <div className="reveal text-center mb-14">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase text-oranged mb-3">
            <span className="w-4 h-0.5 bg-orange rounded"></span>Pricing
          </div>
          <h2 className="font-display text-4xl font-bold text-ink mb-3">Simple, honest pricing</h2>
          <p className="text-base text-inkm max-w-md mx-auto leading-relaxed">No hidden fees. Cancel any time. Start free.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-3xl mx-auto">

          {/* Starter */}
          <div className="reveal bg-white rounded-3xl p-8 border-2 border-cream2 relative hover:-translate-y-1.5 hover:shadow-xl transition-all">
            <div className="font-display font-bold mb-1">🌱 Starter</div>
            <div className="text-xs text-inkm mb-5">Explore the platform, no strings</div>
            <div className="font-display text-5xl font-bold mb-1"><sup className="text-lg align-super">$</sup>0</div>
            <div className="text-xs text-inkm mb-6">Free forever · 1 classroom</div>
            <ul className="space-y-2.5 mb-6">
              <li className="flex items-center gap-2 text-sm"><span className="w-5 h-5 rounded-full bg-teal/10 text-teald flex items-center justify-center text-[10px] font-bold flex-shrink-0">✓</span>3 free stories</li>
              <li className="flex items-center gap-2 text-sm"><span className="w-5 h-5 rounded-full bg-teal/10 text-teald flex items-center justify-center text-[10px] font-bold flex-shrink-0">✓</span>Up to 30 students</li>
              <li className="flex items-center gap-2 text-sm"><span className="w-5 h-5 rounded-full bg-teal/10 text-teald flex items-center justify-center text-[10px] font-bold flex-shrink-0">✓</span>Audio narration</li>
              <li className="flex items-center gap-2 text-sm opacity-35"><span className="w-5 h-5 rounded-full bg-cream2 text-inkm flex items-center justify-center text-[10px] font-bold flex-shrink-0">—</span>Teacher dashboard</li>
              <li className="flex items-center gap-2 text-sm opacity-35"><span className="w-5 h-5 rounded-full bg-cream2 text-inkm flex items-center justify-center text-[10px] font-bold flex-shrink-0">—</span>Story scheduling</li>
            </ul>
            <a href="/login" className="flex w-full items-center justify-center py-3 rounded-full text-sm font-semibold text-inks border-2 border-cream2 hover:border-cream3 hover:bg-white transition-all">Get started free</a>
          </div>

          {/* Classroom — featured */}
          <div className="reveal delay-1 bg-orange rounded-3xl p-8 border-2 border-orange relative md:scale-105 hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-sun text-ink text-[11px] font-bold px-3.5 py-1 rounded-full whitespace-nowrap">⭐ Most popular</div>
            <div className="font-display font-bold text-white mb-1">🏫 Classroom</div>
            <div className="text-xs text-white/70 mb-5">Everything a teacher needs, day one</div>
            <div className="font-display text-5xl font-bold text-white mb-1"><sup className="text-lg align-super">$</sup>29</div>
            <div className="text-xs text-white/70 mb-6">per month · up to 35 students</div>
            <ul className="space-y-2.5 mb-6">
              <li className="flex items-center gap-2 text-sm text-white/80"><span className="w-5 h-5 rounded-full bg-white/20 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">✓</span>150+ stories, unlimited</li>
              <li className="flex items-center gap-2 text-sm text-white/80"><span className="w-5 h-5 rounded-full bg-white/20 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">✓</span>Full teacher dashboard</li>
              <li className="flex items-center gap-2 text-sm text-white/80"><span className="w-5 h-5 rounded-full bg-white/20 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">✓</span>Story of the day</li>
              <li className="flex items-center gap-2 text-sm text-white/80"><span className="w-5 h-5 rounded-full bg-white/20 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">✓</span>Progress tracking</li>
              <li className="flex items-center gap-2 text-sm text-white/80"><span className="w-5 h-5 rounded-full bg-white/20 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">✓</span>New stories monthly</li>
            </ul>
            <a href="/login" className="flex w-full items-center justify-center py-3 rounded-full text-sm font-bold text-orange bg-white hover:bg-sun transition-all">Start 30-day free trial</a>
          </div>

          {/* Institution */}
          <div className="reveal delay-2 bg-white rounded-3xl p-8 border-2 border-cream2 relative hover:-translate-y-1.5 hover:shadow-xl transition-all">
            <div className="font-display font-bold mb-1">🎓 Institution</div>
            <div className="text-xs text-inkm mb-5">For the whole school, centrally managed</div>
            <div className="font-display text-3xl font-bold mb-1 pt-2">Custom</div>
            <div className="text-xs text-inkm mb-6">Volume pricing · multiple classrooms</div>
            <ul className="space-y-2.5 mb-6">
              <li className="flex items-center gap-2 text-sm"><span className="w-5 h-5 rounded-full bg-teal/10 text-teald flex items-center justify-center text-[10px] font-bold flex-shrink-0">✓</span>Everything in Classroom</li>
              <li className="flex items-center gap-2 text-sm"><span className="w-5 h-5 rounded-full bg-teal/10 text-teald flex items-center justify-center text-[10px] font-bold flex-shrink-0">✓</span>Principal dashboard</li>
              <li className="flex items-center gap-2 text-sm"><span className="w-5 h-5 rounded-full bg-teal/10 text-teald flex items-center justify-center text-[10px] font-bold flex-shrink-0">✓</span>Grade-level reports</li>
              <li className="flex items-center gap-2 text-sm"><span className="w-5 h-5 rounded-full bg-teal/10 text-teald flex items-center justify-center text-[10px] font-bold flex-shrink-0">✓</span>Teacher onboarding</li>
              <li className="flex items-center gap-2 text-sm"><span className="w-5 h-5 rounded-full bg-teal/10 text-teald flex items-center justify-center text-[10px] font-bold flex-shrink-0">✓</span>Account manager</li>
            </ul>
            <a href="mailto:schools@magicalstory.com" className="flex w-full items-center justify-center py-3 rounded-full text-sm font-semibold text-white bg-teal hover:bg-teald transition-all">Request a quote</a>
          </div>

        </div>
      </div>
    </section>
  );
}
