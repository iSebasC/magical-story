'use client';

import React, { useEffect } from 'react';
import { siteConfig } from '@/constants/config';

export interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Drawer mobile para navegación
 * Se abre desde el lado derecho con overlay
 */
export const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose }) => {
  // Smooth scroll al hacer clic en los links
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - 76,
          behavior: 'smooth',
        });
      }
      onClose();
    }
  };

  // Prevenir scroll del body cuando está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-ink/30 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 w-72 h-full bg-white z-50 transition-transform duration-300 shadow-2xl flex flex-col gap-1.5 pt-20 px-7 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 bg-cream2 rounded-full flex items-center justify-center text-base hover:bg-cream3 transition-colors"
          aria-label="Cerrar menú"
        >
          ✕
        </button>

        {/* Links de navegación */}
        {siteConfig.navigation.map((item) => (
          <a
            key={item.href}
            href={item.href}
            onClick={(e) => handleLinkClick(e, item.href)}
            className="text-base font-medium text-inks py-2.5 border-b border-cream2 hover:text-orange transition-colors"
          >
            {item.label}
          </a>
        ))}

        {/* CTA */}
        <a
          href="/login?tab=register"
          className="mt-4 flex justify-center items-center px-6 py-3 rounded-full text-sm font-semibold text-white bg-orange hover:bg-oranged transition-all"
        >
          Get started free →
        </a>
      </div>
    </>
  );
};

export default MobileDrawer;
