'use client';

import React, { useEffect, useRef } from 'react';

export default function TestimonialsSection() {
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
    <section ref={sectionRef} className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-7">
        <div className="reveal mb-14">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase text-oranged mb-3">
            <span className="w-4 h-0.5 bg-orange rounded"></span>Testimonials
          </div>
          <h2 className="font-display text-4xl font-bold text-ink mb-3">
            Teachers who <em className="font-normal" style={{ fontStyle: 'italic', color: '#FF6B35' }}>love</em> it
          </h2>
          <p className="text-base text-inkm leading-relaxed">Real classrooms, real results.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="reveal bg-cream rounded-2xl p-6 border-[1.5px] border-transparent hover:border-cream3 hover:-translate-y-1 hover:shadow-lg transition-all">
            <div className="text-sun text-sm mb-3">★★★★★</div>
            <p className="text-sm text-inks leading-relaxed mb-5">
              "The students who never wanted to read now ask me <strong className="text-orange font-semibold">which story is today</strong>. The audio narration completely changed how they experience books."
            </p>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-cream2 border-2 border-white flex items-center justify-center text-base">👩‍🏫</div>
              <div>
                <div className="text-sm font-semibold text-ink">Ms. Carmen Rios</div>
                <div className="text-xs text-inkm">2nd grade teacher · Lima</div>
              </div>
            </div>
          </div>
          <div className="reveal delay-1 bg-cream rounded-2xl p-6 border-[1.5px] border-transparent hover:border-cream3 hover:-translate-y-1 hover:shadow-lg transition-all">
            <div className="text-sun text-sm mb-3">★★★★★</div>
            <p className="text-sm text-inks leading-relaxed mb-5">
              "The classroom dashboard is a game changer. I can see in real-time <strong className="text-orange font-semibold">who needs support</strong> without disrupting anyone. It's like having an assistant."
            </p>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-cream2 border-2 border-white flex items-center justify-center text-base">👨‍🏫</div>
              <div>
                <div className="text-sm font-semibold text-ink">Mr. Luis Mamani</div>
                <div className="text-xs text-inkm">Primary teacher · Cusco</div>
              </div>
            </div>
          </div>
          <div className="reveal delay-2 bg-cream rounded-2xl p-6 border-[1.5px] border-transparent hover:border-cream3 hover:-translate-y-1 hover:shadow-lg transition-all">
            <div className="text-sun text-sm mb-3">★★★★★</div>
            <p className="text-sm text-inks leading-relaxed mb-5">
              "As a principal I was skeptical about cost. But one plan covers 35 kids — <strong className="text-orange font-semibold">far cheaper than buying physical books</strong> every year."
            </p>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-cream2 border-2 border-white flex items-center justify-center text-base">👩‍💼</div>
              <div>
                <div className="text-sm font-semibold text-ink">Mg. Patricia Salas</div>
                <div className="text-xs text-inkm">Principal · Arequipa</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
