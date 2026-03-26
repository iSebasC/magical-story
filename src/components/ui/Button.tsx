import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Componente Button reutilizable
 * Soporta 3 variantes: primary (orange), secondary (teal), outline (borders)
 * Puede usarse como button o link
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  href,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-full font-semibold transition-all';
  
  const variantClasses = {
    primary: 'text-white bg-orange shadow-[0_4px_18px_rgba(255,107,53,.38)] hover:bg-oranged hover:shadow-[0_8px_28px_rgba(255,107,53,.48)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0',
    secondary: 'text-white bg-teal shadow-[0_4px_18px_rgba(0,188,212,.38)] hover:bg-teald hover:shadow-[0_8px_28px_rgba(0,188,212,.48)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0',
    outline: 'text-inks border-2 border-cream2 bg-transparent hover:border-cream3 hover:bg-white hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-10 py-4 text-lg gap-2',
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} disabled={disabled} {...props}>
      {children}
    </button>
  );
};

export default Button;
