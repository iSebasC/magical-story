import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

/**
 * Componente Card reutilizable
 * Tarjeta base con bordes, padding y efectos hover opcionales
 */
export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hover = true 
}) => {
  const hoverClasses = hover
    ? 'hover:border-cream3 hover:shadow-lg hover:-translate-y-1'
    : '';

  return (
    <div
      className={`bg-white rounded-2xl p-6 border-[1.5px] border-cream2 transition-all ${hoverClasses} ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
