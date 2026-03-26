'use client';

import React, { useState } from 'react';

export interface AudioToggleButtonProps {
  className?: string;
}

/**
 * Botón de audio toggle con animación de ondas
 * Alterna entre play (▶) y pause (⏸)
 */
export const AudioToggleButton: React.FC<AudioToggleButtonProps> = ({ 
  className = '' 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleToggle = () => {
    setIsPlaying(!isPlaying);
    // Aquí se podría integrar audio real:
    // if (!isPlaying) audio.play(); else audio.pause();
  };

  return (
    <>
      <button
        onClick={handleToggle}
        className={`w-12 h-12 bg-orange rounded-full flex items-center justify-center text-white text-xl shadow-lg hover:bg-oranged hover:scale-110 transition-all ${className}`}
        aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
      >
        {isPlaying ? '⏸' : '▶'}
      </button>

      {/* Sound waves - visible solo cuando está playing */}
      <div
        className={`absolute -right-10 top-1/2 -translate-y-1/2 flex items-end gap-1 h-16 transition-opacity duration-300 ${
          isPlaying ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <span className="wave-bar animate-wv1 h-3"></span>
        <span className="wave-bar animate-wv2 h-4"></span>
        <span className="wave-bar animate-wv3 h-6"></span>
        <span className="wave-bar animate-wv4 h-8"></span>
        <span className="wave-bar animate-wv5 h-10"></span>
        <span className="wave-bar animate-wv6 h-8"></span>
        <span className="wave-bar animate-wv7 h-6"></span>
        <span className="wave-bar animate-wv8 h-4"></span>
      </div>
    </>
  );
};

export default AudioToggleButton;
