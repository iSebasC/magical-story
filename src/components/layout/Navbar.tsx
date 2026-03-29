'use client';

import React from 'react';
import { useNavbarScroll } from '@/hooks/useNavbarScroll';
import { useMobileDrawer } from '@/hooks/useMobileDrawer';
import { MobileDrawer } from './MobileDrawer';

/**
 * Navbar principal con scroll effect y menú mobile
 */
export const Navbar: React.FC = () => {
  const isScrolled = useNavbarScroll({ threshold: 48 });
  const { isOpen, open, close } = useMobileDrawer();

  // Smooth scroll para links internos
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
    }
  };

  return (
    <>
      <nav
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[rgba(255,253,247,.96)] backdrop-blur-md shadow-sm py-2.5'
            : 'py-4'
        }`}
      >
        <div className="max-w-6xl mx-auto px-7">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2.5 flex-shrink-0">
              <div className="w-9 h-9 bg-orange rounded-xl flex items-center justify-center text-xl shadow-[0_3px_0_#E05520]">
                📖
              </div>
              <span className="font-display text-xl font-bold text-ink">
                Magical <span className="text-orange">Story</span>
              </span>
            </a>

            {/* Links desktop */}
            <ul className="hidden md:flex items-center gap-7">
              <li>
                <a
                  href="#how"
                  onClick={(e) => handleLinkClick(e, '#how')}
                  className="text-sm font-medium text-inkm hover:text-ink transition-colors"
                >
                  How it works
                </a>
              </li>
              <li>
                <a
                  href="#features"
                  onClick={(e) => handleLinkClick(e, '#features')}
                  className="text-sm font-medium text-inkm hover:text-ink transition-colors"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#schools"
                  onClick={(e) => handleLinkClick(e, '#schools')}
                  className="text-sm font-medium text-inkm hover:text-ink transition-colors"
                >
                  For Schools
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  onClick={(e) => handleLinkClick(e, '#pricing')}
                  className="text-sm font-medium text-inkm hover:text-ink transition-colors"
                >
                  Pricing
                </a>
              </li>
            </ul>

            {/* Actions */}
            <div className="flex items-center gap-2.5">
              <a
                href="/login"
                className="hidden md:inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold border-2 border-cream2 text-ink bg-white rounded-full hover:border-cream3 transition-colors"
              >
                Sign in
              </a>
              <a
                href="/login?tab=register"
                className="hidden md:inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold bg-orange text-white rounded-full shadow-[0_4px_0_#E05520] active:shadow-[0_2px_0_#E05520] active:translate-y-0.5 transition-all"
              >
                Get started free
              </a>

              {/* Hamburger mobile */}
              <button
                onClick={open}
                className="flex md:hidden flex-col gap-1.5 p-1"
                aria-label="Abrir menú"
              >
                <span className="w-6 h-0.5 bg-ink rounded-full"></span>
                <span className="w-6 h-0.5 bg-ink rounded-full"></span>
                <span className="w-6 h-0.5 bg-ink rounded-full"></span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Drawer mobile */}
      <MobileDrawer isOpen={isOpen} onClose={close} />
    </>
  );
};

export default Navbar;
