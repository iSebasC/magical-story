'use client';

import { useEffect, useRef } from 'react';

export interface UseRevealOnScrollOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

/**
 * Hook para animar elementos cuando aparecen en el viewport
 * Añade la clase 'in' cuando el elemento es visible
 */
export const useRevealOnScroll = (
  options: UseRevealOnScrollOptions = {}
) => {
  const { threshold = 0, rootMargin = '0px', triggerOnce = true } = options;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            if (triggerOnce) {
              observer.unobserve(entry.target);
            }
          } else if (!triggerOnce) {
            entry.target.classList.remove('in');
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    // Fallback: agregar clase después de 600ms por si acaso
    const fallbackTimer = setTimeout(() => {
      element.classList.add('in');
    }, 600);

    return () => {
      observer.disconnect();
      clearTimeout(fallbackTimer);
    };
  }, [threshold, rootMargin, triggerOnce]);

  return ref;
};

export default useRevealOnScroll;
