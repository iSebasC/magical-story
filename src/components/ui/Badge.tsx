import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

/**
 * Componente Badge/Pill reutilizable
 * Usado para etiquetas, tags, y pequeños indicadores
 */
export const Badge: React.FC<BadgeProps> = ({ children, className = '', icon }) => {
  return (
    <div
      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange/10 border border-orange/20 text-xs font-semibold text-oranged tracking-wide ${className}`}
    >
      {icon && <span>{icon}</span>}
      {children}
    </div>
  );
};

export default Badge;
