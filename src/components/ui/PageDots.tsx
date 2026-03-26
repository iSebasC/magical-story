'use client';

import React, { useEffect, useState } from 'react';

export interface PageDotsProps {
  totalPages?: number;
  intervalMs?: number;
  className?: string;
}

/**
 * Indicador de páginas con animación automática
 * Cicla automáticamente entre los dots
 */
export const PageDots: React.FC<PageDotsProps> = ({
  totalPages = 4,
  intervalMs = 1800,
  className = '',
}) => {
  const [activePage, setActivePage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActivePage((prev) => (prev + 1) % totalPages);
    }, intervalMs);

    return () => clearInterval(interval);
  }, [totalPages, intervalMs]);

  return (
    <div className={`flex gap-2 ${className}`}>
      {Array.from({ length: totalPages }).map((_, index) => (
        <div
          key={index}
          className={`w-2 h-2 rounded-full transition-all duration-300 ${
            index === activePage
              ? 'bg-orange scale-125'
              : 'bg-cream2'
          }`}
        />
      ))}
    </div>
  );
};

export default PageDots;
