'use client';

import React, { useEffect, useRef } from 'react';

export default function SchoolsSection() {
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
    <section ref={sectionRef} className="py-24 bg-teal relative overflow-hidden" id="schools">
      <div className="absolute -top-1/5 -right-1/12 w-96 h-96 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle,rgba(255,255,255,.12) 0%,transparent 65%)' }}></div>
      <div className="absolute -bottom-1/5 -left-1/12 w-80 h-80 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle,rgba(255,255,255,.08) 0%,transparent 65%)' }}></div>

      <div className="max-w-6xl mx-auto px-7 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left */}
          <div>
            <div className="reveal inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase text-white/80 mb-3">
              <span className="w-4 h-0.5 bg-white/80 rounded"></span>For Schools
            </div>
            <h2 className="reveal delay-1 font-display text-4xl font-bold text-white mb-4">
              Your classroom, with reading <em className="font-normal" style={{ fontStyle: 'italic', color: '#FF6B35' }}>superpowers</em>
            </h2>
            <p className="reveal delay-2 text-base text-white/65 mb-7 leading-relaxed max-w-md">
              Magical Story gives teachers full control and students a magical reading experience — without any extra work.
            </p>

            <div className="flex flex-col gap-3 mb-7">
              <div className="reveal delay-3 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center text-base flex-shrink-0 mt-0.5">📊</div>
                <div>
                  <strong className="block text-sm font-semibold text-white mb-0.5">Real-time student tracking</strong>
                  <span className="text-sm text-white/60">Know who finished, who's stuck, and who loved the story.</span>
                </div>
              </div>
              <div className="reveal delay-4 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center text-base flex-shrink-0 mt-0.5">🎯</div>
                <div>
                  <strong className="block text-sm font-semibold text-white mb-0.5">Scheduled story of the day</strong>
                  <span className="text-sm text-white/60">Plan the whole week on Monday morning. Done.</span>
                </div>
              </div>
              <div className="reveal delay-5 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center text-base flex-shrink-0 mt-0.5">📱</div>
                <div>
                  <strong className="block text-sm font-semibold text-white mb-0.5">Works on any device</strong>
                  <span className="text-sm text-white/60">Android tablets, iPads, laptops — no app install needed.</span>
                </div>
              </div>
              <div className="reveal delay-6 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center text-base flex-shrink-0 mt-0.5">🔒</div>
                <div>
                  <strong className="block text-sm font-semibold text-white mb-0.5">Child-safe by design</strong>
                  <span className="text-sm text-white/60">No ads, no social feeds, no distractions. Ever.</span>
                </div>
              </div>
            </div>

            <div className="reveal delay-7 flex flex-wrap gap-3">
              <a href="/login" className="inline-flex items-center px-8 py-4 rounded-full text-base font-bold text-navy bg-white shadow-[0_4px_16px_rgba(0,0,0,.15)] hover:shadow-[0_8px_24px_rgba(0,0,0,.22)] hover:-translate-y-0.5 transition-all">Start 30-day free trial</a>
              <a href="mailto:schools@magicalstory.com" className="inline-flex items-center px-8 py-4 rounded-full text-base font-medium text-white border-2 border-white/35 hover:bg-white/10 hover:border-white/60 hover:-translate-y-0.5 transition-all">Talk to our team</a>
            </div>
          </div>

          {/* Right — stat cards */}
          <div className="reveal delay-2 grid grid-cols-2 gap-3.5">
            <div className="bg-white/18 border border-white/25 rounded-2xl p-5 hover:bg-white/28 hover:-translate-y-1 transition-all">
              <div className="text-2xl mb-2">👧</div>
              <div className="font-display text-4xl font-bold text-white">35</div>
              <div className="text-xs text-white/60 mt-1">Students per classroom included</div>
            </div>
            <div className="bg-white/18 border border-white/25 rounded-2xl p-5 hover:bg-white/28 hover:-translate-y-1 transition-all">
              <div className="text-2xl mb-2">📅</div>
              <div className="font-display text-4xl font-bold text-white">30</div>
              <div className="text-xs text-white/60 mt-1">Days free trial, no card needed</div>
            </div>
            <div className="bg-white/18 border border-white/25 rounded-2xl p-5 hover:bg-white/28 hover:-translate-y-1 transition-all">
              <div className="text-2xl mb-2">📚</div>
              <div className="font-display text-4xl font-bold text-white">150+</div>
              <div className="text-xs text-white/60 mt-1">Stories, new ones every month</div>
            </div>
            <div className="bg-white/18 border border-white/25 rounded-2xl p-5 hover:bg-white/28 hover:-translate-y-1 transition-all">
              <div className="text-2xl mb-2">⭐</div>
              <div className="font-display text-4xl font-bold text-white">4.9</div>
              <div className="text-xs text-white/60 mt-1">Average teacher satisfaction</div>
            </div>
            <div className="col-span-2 bg-white/18 border border-white/25 rounded-2xl p-5 flex items-center gap-4 hover:bg-white/28 hover:-translate-y-1 transition-all">
              <div className="text-3xl">🎓</div>
              <div>
                <div className="font-display text-2xl font-bold text-white">No lock-in</div>
                <div className="text-xs text-white/60 mt-1">Cancel anytime. No questions, no hidden fees.</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
