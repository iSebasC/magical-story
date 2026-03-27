'use client';

import React, { useEffect, useRef } from 'react';

/**
 * Sección How It Works con 4 pasos
 */
export const HowItWorksSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const revealElements = sectionRef.current.querySelectorAll('.reveal');
    
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

    revealElements.forEach((el) => observer.observe(el));

    const fallbackTimer = setTimeout(() => {
      revealElements.forEach((el) => el.classList.add('in'));
    }, 600);

    return () => {
      observer.disconnect();
      clearTimeout(fallbackTimer);
    };
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-white" id="how">
      <div className="max-w-6xl mx-auto px-7">
        <div className="mb-14">
          <div className="reveal inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase text-oranged mb-3">
            <span className="w-4 h-0.5 bg-orange rounded"></span>How it works
          </div>
          <h2 className="reveal delay-1 font-display text-4xl font-bold text-ink mb-3">
            Reading in four{' '}
            <em className="font-normal" style={{ fontStyle: 'italic', color: '#FF6B35' }}>
              simple
            </em>{' '}
            steps
          </h2>
          <p className="reveal delay-2 text-base text-inkm max-w-lg leading-relaxed">
            From sign-up to your first story in under two minutes. No credit card
            required.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 relative">
          <div className="hidden lg:block absolute top-7 left-[12.5%] right-[12.5%] h-px bg-cream2"></div>

          {/* Step 1 */}
          <div className="reveal delay-3 relative z-10 text-center p-6 bg-cream rounded-2xl border-[1.5px] border-transparent hover:border-cream3 hover:shadow-lg hover:-translate-y-1 transition-all">
            <div className="w-11 h-11 rounded-full bg-orange shadow-[0_4px_12px_rgba(255,107,53,.4)] flex items-center justify-center font-display text-base font-bold text-white mx-auto mb-4">
              01
            </div>
            <div className="text-2xl mb-2">✉️</div>
            <h3 className="font-display font-semibold text-ink mb-1.5">
              Create your account
            </h3>
            <p className="text-sm text-inkm leading-relaxed">
              Sign up with email in seconds. Free forever for the starter plan.
            </p>
          </div>

          {/* Step 2 */}
          <div className="reveal delay-4 relative z-10 text-center p-6 bg-cream rounded-2xl border-[1.5px] border-transparent hover:border-cream3 hover:shadow-lg hover:-translate-y-1 transition-all">
            <div className="w-11 h-11 rounded-full bg-teal shadow-[0_4px_12px_rgba(0,188,212,.4)] flex items-center justify-center font-display text-base font-bold text-white mx-auto mb-4">
              02
            </div>
            <div className="text-2xl mb-2">📚</div>
            <h3 className="font-display font-semibold text-ink mb-1.5">
              Browse the library
            </h3>
            <p className="text-sm text-inkm leading-relaxed">
              Explore 150+ stories organized by age, topic, and reading time.
            </p>
          </div>

          {/* Step 3 */}
          <div className="reveal delay-5 relative z-10 text-center p-6 bg-cream rounded-2xl border-[1.5px] border-transparent hover:border-cream3 hover:shadow-lg hover:-translate-y-1 transition-all">
            <div className="w-11 h-11 rounded-full bg-plum shadow-[0_4px_12px_rgba(126,87,194,.4)] flex items-center justify-center font-display text-base font-bold text-white mx-auto mb-4">
              03
            </div>
            <div className="text-2xl mb-2">🎧</div>
            <h3 className="font-display font-semibold text-ink mb-1.5">
              Read &amp; listen
            </h3>
            <p className="text-sm text-inkm leading-relaxed">
              Follow along with expressive audio narration, page by page.
            </p>
          </div>

          {/* Step 4 */}
          <div className="reveal delay-6 relative z-10 text-center p-6 bg-cream rounded-2xl border-[1.5px] border-transparent hover:border-cream3 hover:shadow-lg hover:-translate-y-1 transition-all">
            <div className="w-11 h-11 rounded-full bg-oranged shadow-[0_4px_12px_rgba(224,85,32,.4)] flex items-center justify-center font-display text-base font-bold text-white mx-auto mb-4">
              04
            </div>
            <div className="text-2xl mb-2">📊</div>
            <h3 className="font-display font-semibold text-ink mb-1.5">
              Track progress
            </h3>
            <p className="text-sm text-inkm leading-relaxed">
              Teachers see real-time reading data for every student in class.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
