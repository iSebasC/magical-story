'use client';

import React, { useEffect, useRef } from 'react';

export default function WhySELSection() {
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
    <section ref={sectionRef} className="py-24 bg-white" id="features">
      <div className="max-w-6xl mx-auto px-7">
        <div className="mb-14">
          <div className="reveal inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase text-oranged mb-3">
            <span className="w-4 h-0.5 bg-orange rounded"></span>Why SEL story lesson
          </div>
          <h2 className="reveal delay-1 font-display text-4xl font-bold text-ink mb-3">
            Teachers{' '}
            <em className="font-normal" style={{ fontStyle: 'italic', color: '#FF6B35' }}>
              Love
            </em>{' '}
            It
          </h2>
          <p className="reveal delay-2 text-base text-inkm max-w-lg leading-relaxed">
            This platform was created by a teacher, for teachers.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-20">
          <div className="reveal delay-3 bg-cream rounded-2xl p-7 border-[1.5px] border-transparent hover:border-cream3 hover:shadow-lg hover:-translate-y-1 transition-all">
            <div className="w-11 h-11 rounded-xl bg-orange/10 flex items-center justify-center text-xl mb-4">⏱️</div>
            <h3 className="font-display text-lg font-medium tracking-wide text-ink mb-1.5">Saves planning time</h3>
            <p className="text-sm text-inkm leading-relaxed">
              Saves planning time with ready-made lessons
            </p>
          </div>

          <div className="reveal delay-4 bg-cream rounded-2xl p-7 border-[1.5px] border-transparent hover:border-cream3 hover:shadow-lg hover:-translate-y-1 transition-all">
            <div className="w-11 h-11 rounded-xl bg-teal/10 flex items-center justify-center text-xl mb-4">📖</div>
            <h3 className="font-display text-lg font-medium tracking-wide text-ink mb-1.5">Keeps children engaged</h3>
            <p className="text-sm text-inkm leading-relaxed">
              Keeps children engaged through storytelling and play
            </p>
          </div>

          <div className="reveal delay-5 bg-cream rounded-2xl p-7 border-[1.5px] border-transparent hover:border-cream3 hover:shadow-lg hover:-translate-y-1 transition-all">
            <div className="w-11 h-11 rounded-xl bg-plum/10 flex items-center justify-center text-xl mb-4">🔄</div>
            <h3 className="font-display text-lg font-medium tracking-wide text-ink mb-1.5">Consistent SEL teaching</h3>
            <p className="text-sm text-inkm leading-relaxed">
              Supports consistent SEL teaching across classes
            </p>
          </div>

          <div className="reveal delay-6 bg-cream rounded-2xl p-7 border-[1.5px] border-transparent hover:border-cream3 hover:shadow-lg hover:-translate-y-1 transition-all">
            <div className="w-11 h-11 rounded-xl bg-sun/10 flex items-center justify-center text-xl mb-4">👩‍🏫</div>
            <h3 className="font-display text-lg font-medium tracking-wide text-ink mb-1.5">Easy for multiple teachers</h3>
            <p className="text-sm text-inkm leading-relaxed">
              Easy to use for multiple teachers simultaneously
            </p>
          </div>
        </div>

        {/* Reviews */}
        <div>
          <div className="reveal inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase text-oranged mb-8">
            <span className="w-4 h-0.5 bg-orange rounded"></span>What teachers say
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="reveal delay-3 bg-cream rounded-2xl p-7 border-[1.5px] border-cream2">
              <p className="text-sm text-inkm leading-relaxed italic mb-4">&ldquo;Review coming soon&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-cream3 flex items-center justify-center text-sm">👩‍🏫</div>
                <div>
                  <p className="text-sm font-semibold text-ink">Teacher Name</p>
                  <p className="text-xs text-inkm">School</p>
                </div>
              </div>
            </div>
            <div className="reveal delay-4 bg-cream rounded-2xl p-7 border-[1.5px] border-cream2">
              <p className="text-sm text-inkm leading-relaxed italic mb-4">&ldquo;Review coming soon&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-cream3 flex items-center justify-center text-sm">👨‍🏫</div>
                <div>
                  <p className="text-sm font-semibold text-ink">James O&apos;Connor</p>
                  <p className="text-xs text-inkm">Riverside Academy</p>
                </div>
              </div>
            </div>
            <div className="reveal delay-5 bg-cream rounded-2xl p-7 border-[1.5px] border-cream2">
              <p className="text-sm text-inkm leading-relaxed italic mb-4">&ldquo;Review coming soon&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-cream3 flex items-center justify-center text-sm">👩‍🏫</div>
                <div>
                  <p className="text-sm font-semibold text-ink">Emily Walker</p>
                  <p className="text-xs text-inkm">Oakwood Prep School</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
