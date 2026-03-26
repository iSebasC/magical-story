'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * Hook para manejar el estado del drawer mobile
 */
export const useMobileDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => {
    setIsOpen(true);
    // Prevenir scroll del body cuando el drawer está abierto
    document.body.style.overflow = 'hidden';
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    document.body.style.overflow = '';
  }, []);

  const toggle = useCallback(() => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  }, [isOpen, open, close]);

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return { isOpen, open, close, toggle };
};

export default useMobileDrawer;
