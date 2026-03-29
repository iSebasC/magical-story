'use client';

import React, { useEffect, useRef } from 'react';

/**
 * Sección CTA Final antes del footer
 */
export const CTASection: React.FC = () => {
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
    <section ref={sectionRef} className="py-28 text-center bg-cream relative overflow-hidden">
      {/* Gradiente decorativo */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 50%,rgba(255,107,53,.09) 0%,transparent 60%)',
        }}
      ></div>

      <div className="max-w-6xl mx-auto px-7 relative z-10">
        <div className="text-5xl mb-5">📖✨</div>
        <h2 className="reveal font-display text-5xl font-bold text-ink mb-4 leading-tight">
          Ready to open the
          <br />
          <em className="font-normal" style={{ fontStyle: 'italic', color: '#FF6B35' }}>
            first chapter?
          </em>
        </h2>
        <p className="reveal delay-1 text-base text-inkm max-w-md mx-auto mb-10 leading-relaxed">
          Join 120+ schools that turned reading into the best part of the school day.
          The first 30 days are completely free.
        </p>
        <div className="reveal delay-2 flex flex-wrap justify-center gap-3 mb-5">
          <a
            href="/login?tab=register"
            className="inline-flex items-center justify-center gap-1.5 px-6 py-3 text-sm font-semibold bg-orange text-white rounded-full shadow-[0_4px_0_#E05520] active:shadow-[0_2px_0_#E05520] active:translate-y-0.5 transition-all"
          >
            Start for free →
          </a>
          <a
            href="mailto:schools@magicalstory.com"
            className="inline-flex items-center justify-center gap-1.5 px-6 py-3 text-sm font-semibold border-2 border-cream2 text-ink bg-white rounded-full hover:border-cream3 transition-colors"
          >
            Talk to us
          </a>
        </div>
        <p className="reveal delay-3 text-sm text-inkl">
          <strong className="text-orange">30 days free</strong> · No credit card · Cancel
          anytime
        </p>
      </div>
    </section>
  );
};

export default CTASection;
