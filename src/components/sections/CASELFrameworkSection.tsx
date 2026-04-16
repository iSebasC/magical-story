'use client';

import React, { useEffect, useRef } from 'react';

export default function CASELFrameworkSection() {
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
    <section ref={sectionRef} className="py-24 bg-cream">
      <div className="max-w-6xl mx-auto px-7">
        <div className="mb-14">
          <div className="reveal inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase text-oranged mb-3">
            <span className="w-4 h-0.5 bg-orange rounded"></span>CASEL Framework
          </div>
          <h2 className="reveal delay-1 font-display text-4xl font-bold text-ink mb-3">
            The CASEL{' '}
            <em className="font-normal" style={{ fontStyle: 'italic', color: '#FF6B35' }}>
              Framework
            </em>
          </h2>
          <p className="reveal delay-2 text-base text-inkm max-w-lg leading-relaxed">
            Each story is aligned with the 5 Core Competencies of the Social and Emotional Learning framework, providing a well-rounded SEL experience.
          </p>
        </div>

        {/* 5 Competencies */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 mb-10">
          <div className="reveal delay-3 bg-white rounded-2xl p-6 border-[1.5px] border-transparent hover:border-cream3 hover:shadow-lg hover:-translate-y-1 transition-all text-center">
            <div className="w-12 h-12 rounded-full bg-orange/10 flex items-center justify-center text-2xl mx-auto mb-4">🪞</div>
            <h3 className="font-display text-sm font-medium tracking-wide text-ink mb-1.5">Self-Awareness</h3>
            <p className="text-sm text-inkm leading-relaxed">
              Children learn to recognise and name their emotions
            </p>
          </div>

          <div className="reveal delay-4 bg-white rounded-2xl p-6 border-[1.5px] border-transparent hover:border-cream3 hover:shadow-lg hover:-translate-y-1 transition-all text-center">
            <div className="w-12 h-12 rounded-full bg-teal/10 flex items-center justify-center text-2xl mx-auto mb-4">🧘</div>
            <h3 className="font-display text-sm font-medium tracking-wide text-ink mb-1.5">Self-Management</h3>
            <p className="text-sm text-inkm leading-relaxed">
              Children develop strategies to manage big feelings
            </p>
          </div>

          <div className="reveal delay-5 bg-white rounded-2xl p-6 border-[1.5px] border-transparent hover:border-cream3 hover:shadow-lg hover:-translate-y-1 transition-all text-center">
            <div className="w-12 h-12 rounded-full bg-plum/10 flex items-center justify-center text-2xl mx-auto mb-4">🤝</div>
            <h3 className="font-display text-sm font-medium tracking-wide text-ink mb-1.5">Social Awareness</h3>
            <p className="text-sm text-inkm leading-relaxed">
              Children build empathy and understanding of others
            </p>
          </div>

          <div className="reveal delay-6 bg-white rounded-2xl p-6 border-[1.5px] border-transparent hover:border-cream3 hover:shadow-lg hover:-translate-y-1 transition-all text-center">
            <div className="w-12 h-12 rounded-full bg-sun/10 flex items-center justify-center text-2xl mx-auto mb-4">💬</div>
            <h3 className="font-display text-sm font-medium tracking-wide text-ink mb-1.5">Relationship Skills</h3>
            <p className="text-sm text-inkm leading-relaxed">
              Children learn how to communicate and build friendships
            </p>
          </div>

          <div className="reveal delay-7 bg-white rounded-2xl p-6 border-[1.5px] border-transparent hover:border-cream3 hover:shadow-lg hover:-translate-y-1 transition-all text-center">
            <div className="w-12 h-12 rounded-full bg-oranged/10 flex items-center justify-center text-2xl mx-auto mb-4">⚖️</div>
            <h3 className="font-display text-sm font-medium tracking-wide text-ink mb-1.5">Responsible Decision-Making</h3>
            <p className="text-sm text-inkm leading-relaxed">
              Children explore choices, consequences, and behaviours
            </p>
          </div>
        </div>

        <p className="reveal delay-3 text-base text-inkm max-w-2xl mx-auto text-center leading-relaxed">
          Each story supports multiple competencies, offering a comprehensive SEL experience for children.
        </p>
      </div>
    </section>
  );
}
