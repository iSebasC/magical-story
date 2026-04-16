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
          Access the first two
          <br />
          <em className="font-normal" style={{ fontStyle: 'italic', color: '#FF6B35' }}>
            stories for free
          </em>
        </h2>
        <p className="reveal delay-1 text-base text-inkm max-w-md mx-auto mb-10 leading-relaxed">
          Start exploring our SEL storybooks today. No credit card required.
        </p>
        <div className="reveal delay-2 flex flex-wrap justify-center gap-3 mb-5">
          <a
            href="/login?tab=register"
            className="inline-flex items-center justify-center gap-1.5 px-6 py-3 text-sm font-semibold bg-orange text-white rounded-full shadow-[0_4px_0_#E05520] active:shadow-[0_2px_0_#E05520] active:translate-y-0.5 transition-all"
          >
            Access the first two stories for free →
          </a>
        </div>
        <p className="reveal delay-3 text-sm text-inkl">
          <strong className="text-orange">Free access</strong> · No credit card · Cancel
          anytime
        </p>
      </div>
    </section>
  );
};

export default CTASection;
