'use client';

import React, { useEffect, useRef } from 'react';

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

            <h1 className="reveal delay-1 font-display text-5xl lg:text-6xl font-bold leading-[1.12] text-ink mb-5 tracking-tight">
              Where every page<br />
              opens a <em className="font-normal not-italic" style={{ fontStyle: 'italic', color: '#FF6B35' }}>world</em> for<br />
              <span className="lined-word">young minds</span>
            </h1>

            <p className="reveal delay-2 text-base text-inkm max-w-md mb-8 leading-relaxed">
              Interactive storybooks with professional narration, a classroom dashboard,
              and a library that grows every month. The reading habit starts here.
            </p>

            <div className="reveal delay-3 flex flex-wrap items-center gap-3 mb-10">
              <a
                href="/auth?tab=register"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-semibold text-white bg-orange shadow-[0_4px_18px_rgba(255,107,53,.38)] hover:bg-oranged hover:shadow-[0_8px_28px_rgba(255,107,53,.48)] hover:-translate-y-0.5 transition-all"
              >
                Start for free →
              </a>
              <a
                href="#schools"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-semibold text-inks border-2 border-cream2 hover:border-cream3 hover:bg-white transition-all hover:-translate-y-0.5"
              >
                For schools
              </a>
            </div>

            <div className="reveal delay-4 flex items-center gap-3.5">
              <div className="flex">
                <div className="w-7 h-7 rounded-full border-2 border-white bg-cream2 flex items-center justify-center text-sm -ml-0 z-10">
                  👩‍🏫
                </div>
                <div className="w-7 h-7 rounded-full border-2 border-white bg-cream2 flex items-center justify-center text-sm -ml-1.5 z-10">
                  👨‍🏫
                </div>
                <div className="w-7 h-7 rounded-full border-2 border-white bg-cream2 flex items-center justify-center text-sm -ml-1.5 z-10">
                  👩‍🏫
                </div>
                <div className="w-7 h-7 rounded-full border-2 border-white bg-cream3 flex items-center justify-center text-[10px] font-bold text-inkm -ml-1.5 z-10">
                  +120
                </div>
              </div>
              <p className="text-xs text-inkm leading-snug">
                <strong className="text-inks font-semibold">120+ schools</strong> already
                use Magical Story
                <br />
                in their classrooms every day
              </p>
            </div>
          </div>

          {/* Visual */}
          <div className="reveal delay-2 flex justify-center lg:justify-end relative">
            {/* Book card */}
            <div className="w-full max-w-sm bg-white rounded-4xl overflow-hidden shadow-[0_20px_56px_rgba(52,78,122,.15)] animate-float">
              {/* Illustration */}
              <div
                className="w-full aspect-[4/3] overflow-hidden"
                style={{ background: 'linear-gradient(160deg,#87CEEB,#B0E0F8,#D4F5E9)' }}
              >
                <svg
                  viewBox="0 0 420 280"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full"
                >
                  <defs>
                    <linearGradient id="skyg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#87CEEB" />
                      <stop offset="100%" stopColor="#D4F5E9" />
                    </linearGradient>
                  </defs>
                  <rect width="420" height="280" fill="url(#skyg)" />
                  <circle cx="340" cy="58" r="36" fill="#FFD54F" opacity=".9" />
                  <circle cx="354" cy="47" r="28" fill="#B0E0F8" opacity=".7" />
                  <circle cx="60" cy="38" r="2.5" fill="#fff" opacity=".8" />
                  <circle cx="160" cy="22" r="2" fill="#fff" opacity=".6" />
                  <circle cx="220" cy="52" r="2" fill="#fff" opacity=".7" />
                  <path
                    d="M0 200 Q80 155 160 188 Q240 220 320 178 Q380 150 420 182 L420 280 L0 280Z"
                    fill="#81C784"
                    opacity=".6"
                  />
                  <path
                    d="M0 225 Q100 192 200 218 Q300 244 420 210 L420 280 L0 280Z"
                    fill="#A5D6A7"
                    opacity=".5"
                  />
                  <rect x="28" y="195" width="10" height="52" fill="#5D4037" />
                  <circle cx="33" cy="178" r="30" fill="#66BB6A" />
                  <rect x="372" y="200" width="9" height="48" fill="#5D4037" />
                  <circle cx="376" cy="185" r="26" fill="#66BB6A" />
                  <rect
                    x="132"
                    y="142"
                    width="156"
                    height="108"
                    rx="12"
                    fill="#FF6B35"
                    opacity=".9"
                  />
                  <rect x="138" y="148" width="72" height="96" rx="8" fill="#FFFEF7" />
                  <rect x="210" y="148" width="72" height="96" rx="8" fill="#FFF8EE" />
                  <rect x="205" y="148" width="10" height="96" rx="4" fill="#D96840" />
                  <rect x="147" y="163" width="55" height="4" rx="2" fill="#E8D8C8" />
                  <rect x="147" y="173" width="46" height="3" rx="1.5" fill="#E8D8C8" />
                  <rect x="147" y="181" width="52" height="3" rx="1.5" fill="#E8D8C8" />
                  <circle cx="246" cy="190" r="20" fill="rgba(0,188,212,.25)" />
                  <circle cx="246" cy="183" r="12" fill="#FF6B35" opacity=".7" />
                  <rect x="239" y="196" width="14" height="10" rx="3" fill="#FF6B35" opacity=".7" />
                  <circle cx="163" cy="250" r="16" fill="#FDDBA0" />
                  <ellipse cx="163" cy="237" rx="14" ry="7" fill="#7B5C3A" />
                  <circle cx="157" cy="250" r="2.5" fill="#2D3561" />
                  <circle cx="169" cy="250" r="2.5" fill="#2D3561" />
                  <path
                    d="M158 257 Q163 262 168 257"
                    stroke="#2D3561"
                    strokeWidth="1.5"
                    fill="none"
                  />
                  <ellipse cx="163" cy="263" rx="14" ry="10" fill="#00BCD4" />
                  <circle cx="210" cy="246" r="17" fill="#FDDBA0" />
                  <ellipse cx="210" cy="233" rx="15" ry="8" fill="#2D3561" />
                  <circle cx="204" cy="246" r="2.5" fill="#2D3561" />
                  <circle cx="216" cy="246" r="2.5" fill="#2D3561" />
                  <path
                    d="M205 254 Q210 259 215 254"
                    stroke="#2D3561"
                    strokeWidth="1.5"
                    fill="none"
                  />
                  <ellipse cx="210" cy="260" rx="14" ry="10" fill="#7E57C2" />
                  <circle cx="255" cy="250" r="16" fill="#F5CBA7" />
                  <ellipse cx="255" cy="237" rx="14" ry="7" fill="#C0874A" />
                  <circle cx="249" cy="250" r="2.5" fill="#2D3561" />
                  <circle cx="261" cy="250" r="2.5" fill="#2D3561" />
                  <path
                    d="M250 257 Q255 262 260 257"
                    stroke="#2D3561"
                    strokeWidth="1.5"
                    fill="none"
                  />
                  <ellipse cx="255" cy="263" rx="14" ry="10" fill="#FF6B35" />
                </svg>
              </div>
              {/* Strip */}
              <div className="p-5 border-t border-cream2">
                <p className="font-display font-semibold text-ink mb-3">
                  The Brave Little Lion
                </p>
                <div className="flex items-center gap-2.5 px-3 py-2 bg-cream rounded-xl">
                  <button
                    id="audioBtn"
                    className="w-8 h-8 bg-orange rounded-full flex items-center justify-center text-white text-xs shadow-[0_3px_0_#E05520] flex-shrink-0 hover:scale-110 transition-transform"
                  >
                    ▶
                  </button>
                  <div className="flex items-center gap-0.5 flex-1 h-4">
                    <span
                      className="wave-bar h-1.5"
                      style={{ animationDelay: '0s' }}
                    ></span>
                    <span
                      className="wave-bar h-3"
                      style={{ animationDelay: '.1s' }}
                    ></span>
                    <span
                      className="wave-bar h-2"
                      style={{ animationDelay: '.2s' }}
                    ></span>
                    <span
                      className="wave-bar h-4"
                      style={{ animationDelay: '.3s' }}
                    ></span>
                    <span
                      className="wave-bar h-2.5"
                      style={{ animationDelay: '.4s' }}
                    ></span>
                    <span
                      className="wave-bar h-3.5"
                      style={{ animationDelay: '.3s' }}
                    ></span>
                    <span
                      className="wave-bar h-1.5"
                      style={{ animationDelay: '.2s' }}
                    ></span>
                    <span
                      className="wave-bar h-2.5"
                      style={{ animationDelay: '.1s' }}
                    ></span>
                  </div>
                  <span className="text-[11px] font-semibold text-inkm">
                    1:24 / 4:10
                  </span>
                </div>
                <div className="flex gap-1.5 mt-2.5" id="pageDots">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange scale-125 transition-all"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-cream2 transition-all"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-cream2 transition-all"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-cream2 transition-all"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-cream2 transition-all"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-cream2 transition-all"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-cream2 transition-all"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-cream2 transition-all"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
