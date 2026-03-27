'use client';

import React, { useEffect, useRef, useState } from 'react';

/**
 * Trust Bar con estadísticas principales y contadores animados
 */
export const TrustBar: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [schools, setSchools] = useState(0);
  const [students, setStudents] = useState(0);
  const [stories, setStories] = useState(0);
  const [rating, setRating] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reveals = section.querySelectorAll('.reveal');
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            
            // Iniciar contadores solo una vez
            if (!hasAnimated) {
              setHasAnimated(true);
              animateCounters();
            }
          }
        });
      },
      { threshold: 0.3 }
    );

    reveals.forEach((el) => observer.observe(el));

    const timer = setTimeout(() => {
      reveals.forEach((el) => el.classList.add('in'));
      if (!hasAnimated) {
        setHasAnimated(true);
        animateCounters();
      }
    }, 600);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [hasAnimated]);

  const animateCounters = () => {
    const duration = 1500; // 1.5 segundos
    const fps = 60;
    const totalFrames = (duration / 1000) * fps;

    // Valores objetivo
    const targets = {
      schools: 120,
      students: 8500,
      stories: 150,
      rating: 4.9,
      readingTime: 3,
    };

    let frame = 0;

    const animate = () => {
      frame++;
      const progress = Math.min(frame / totalFrames, 1);
      
      // Easing function para suavizar (easeOutExpo)
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      setSchools(Math.floor(targets.schools * easeProgress));
      setStudents(Math.floor(targets.students * easeProgress));
      setStories(Math.floor(targets.stories * easeProgress));
      setRating(parseFloat((targets.rating * easeProgress).toFixed(1)));
      setReadingTime(Math.floor(targets.readingTime * easeProgress));

      if (frame < totalFrames) {
        requestAnimationFrame(animate);
      } else {
        // Asegurar valores finales exactos
        setSchools(targets.schools);
        setStudents(targets.students);
        setStories(targets.stories);
        setRating(targets.rating);
        setReadingTime(targets.readingTime);
      }
    };

    requestAnimationFrame(animate);
  };

  return (
    <div ref={sectionRef} className="bg-white border-t border-b border-cream2 py-5">
      <div className="max-w-6xl mx-auto px-7">
        <div className="flex flex-wrap justify-around items-center gap-5">
          <div className="reveal text-center">
            <div className="font-display text-2xl font-bold text-ink">{schools}+</div>
            <div className="text-xs text-inkm mt-0.5">Schools worldwide</div>
          </div>
          <div className="hidden sm:block w-px h-8 bg-cream2"></div>
          <div className="reveal delay-1 text-center">
            <div className="font-display text-2xl font-bold text-ink">{students.toLocaleString()}</div>
            <div className="text-xs text-inkm mt-0.5">Active students</div>
          </div>
          <div className="hidden sm:block w-px h-8 bg-cream2"></div>
          <div className="reveal delay-2 text-center">
            <div className="font-display text-2xl font-bold text-ink">{stories}+</div>
            <div className="text-xs text-inkm mt-0.5">Stories available</div>
          </div>
          <div className="hidden sm:block w-px h-8 bg-cream2"></div>
          <div className="reveal delay-3 text-center">
            <div className="font-display text-2xl font-bold text-ink">{rating} ★</div>
            <div className="text-xs text-inkm mt-0.5">Teacher rating</div>
          </div>
          <div className="hidden sm:block w-px h-8 bg-cream2"></div>
          <div className="reveal delay-4 text-center">
            <div className="font-display text-2xl font-bold text-ink">{readingTime}×</div>
            <div className="text-xs text-inkm mt-0.5">More reading time</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustBar;
