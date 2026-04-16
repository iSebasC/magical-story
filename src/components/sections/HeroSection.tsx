'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

/**
 * Sección Hero principal con CTA y visual interactivo
 */
export const HeroSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const revealElements = sectionRef.current.querySelectorAll('.reveal');

    // Activar animaciones secuencialmente al montar el componente
    revealElements.forEach((el, index) => {
      // Pequeño delay base + delay por índice para efecto escalonado
      const baseDelay = 100; // delay inicial
      const incrementalDelay = el.classList.contains('delay-1') ? 80 :
        el.classList.contains('delay-2') ? 160 :
          el.classList.contains('delay-3') ? 240 :
            el.classList.contains('delay-4') ? 320 : 0;

      setTimeout(() => {
        el.classList.add('in');
      }, baseDelay + incrementalDelay);
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      className="min-h-screen flex items-center pt-32 pb-20 relative overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse 55% 50% at 75% 30%,rgba(0,188,212,.14) 0%,transparent 70%),radial-gradient(ellipse 45% 55% at 8% 75%,rgba(126,87,194,.10) 0%,transparent 65%),radial-gradient(ellipse 40% 40% at 50% 10%,rgba(255,213,79,.12) 0%,transparent 60%),#FFFDF7',
      }}
    >
      <div className="max-w-6xl mx-auto px-7 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          {/* Copy */}
          <div>
            <div className="reveal inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange/10 border border-orange/20 text-xs font-semibold text-oranged tracking-wide mb-5">
              <span className="w-1.5 h-1.5 bg-orange rounded-full animate-blink"></span>
              Interactive stories · Built for schools
            </div>

            <h1 className="reveal delay-1 font-display text-5xl lg:text-5xl font-bold leading-[1.10] text-ink mb-5 tracking-tight">
              Building Wellbeing<br />
              One Story <em className="font-normal not-italic" style={{ fontStyle: 'italic', color: '#FF6B35' }}>at</em> a<br />
              <span className="lined-word">time</span>
            </h1>

            <p className="reveal delay-2 text-base text-inkm max-w-md mb-8 leading-relaxed">
              <span className='font-bold block'>Making Social and Emotional Learning Simple, Engaging, and Ready to Use.</span>
              A growing digital library of engaging SEL storybooks, each designed as a complete mini-lesson with printable resources. For children aged 4–8 to understand and manage their emotions, build confidence, and develop strong relationships—through engaging stories, chants and follow-up activities.
            </p>

            <ul className="reveal delay-2 flex flex-col gap-2 mb-8 max-w-md">
              <li className="flex items-center gap-2 text-sm text-inks font-medium">
                <span className="w-5 h-5 rounded-full bg-mint/20 text-teal flex items-center justify-center text-xs">✓</span>
                Ready-to-use story lessons
              </li>
              <li className="flex items-center gap-2 text-sm text-inks font-medium">
                <span className="w-5 h-5 rounded-full bg-mint/20 text-teal flex items-center justify-center text-xs">✓</span>
                Minimal preparation for teachers
              </li>
              <li className="flex items-center gap-2 text-sm text-inks font-medium">
                <span className="w-5 h-5 rounded-full bg-mint/20 text-teal flex items-center justify-center text-xs">✓</span>
                Whole-class or small group use
              </li>
            </ul>

            <div className="reveal delay-3 flex flex-wrap items-center gap-3 mb-10">
              <a
                href="/login?tab=register"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-semibold text-white bg-orange shadow-[0_4px_18px_rgba(255,107,53,.38)] hover:bg-oranged hover:shadow-[0_8px_28px_rgba(255,107,53,.48)] hover:-translate-y-0.5 transition-all"
              >
                Start for free →
              </a>
            </div>

           
          </div>

          {/* Visual */}
          <div className="reveal delay-2 flex justify-center lg:justify-end relative">
            <Link href="/login" className="w-full max-w-sm rounded-4xl overflow-hidden shadow-[0_20px_56px_rgba(52,78,122,.15)] animate-float block hover:shadow-[0_24px_64px_rgba(52,78,122,.22)] transition-shadow">
              <Image
                src="/images/andy.png"
                alt="Andy The Angry Ape - Book Cover"
                width={400}
                height={533}
                quality={100}
                priority
                className="w-full h-auto object-cover"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
