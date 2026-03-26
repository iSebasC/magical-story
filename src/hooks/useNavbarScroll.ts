'use client';

import { useEffect, useState } from 'react';

export interface UseNavbarScrollOptions {
  threshold?: number;
}

/**
 * Hook para detectar scroll y aplicar estilos al navbar
 * Retorna isScrolled: true cuando el scroll > threshold
 */
export const useNavbarScroll = (options: UseNavbarScrollOptions = {}) => {
  const { threshold = 48 } = options;
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Check inicial
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [threshold]);

  return isScrolled;
};

export default useNavbarScroll;
