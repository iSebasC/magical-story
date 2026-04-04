'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Story } from '@/types/stories';

interface StoryViewerProps {
  isOpen: boolean;
  story: Story | null;
  onClose: () => void;
}

export function StoryViewer({ isOpen, story, onClose }: StoryViewerProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentPage(0);
      setIsAudioPlaying(false);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || !story) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && currentPage > 0) setCurrentPage(currentPage - 1);
      if (e.key === 'ArrowRight' && currentPage < story.pages.length - 1) setCurrentPage(currentPage + 1);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentPage, story, onClose]);

  if (!isOpen || !story) return null;

  const page = story.pages[currentPage];
  const totalPages = story.pages.length;

  return (
    <div 
      className="fixed inset-0 bg-ink/50 backdrop-blur-sm z-500 flex items-center justify-center p-5 opacity-100 transition-opacity"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl w-full max-w-2xl flex flex-col overflow-hidden shadow-2xl"
        style={{ maxHeight: '90vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cream2 shrink-0">
          <h2 className="font-display text-lg font-bold text-ink">{story.title}</h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-cream2 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-inkm" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto flex items-center justify-center p-6 bg-cream">
          <div 
            className="w-full max-w-md rounded-2xl p-8 shadow-lg text-center relative overflow-hidden transition-all"
            style={{ background: page.bg, minHeight: '320px' }}
          >
            <div className="text-7xl mb-5">{page.emoji}</div>
            <p className="text-base leading-relaxed text-ink font-medium">{page.text}</p>
          </div>
        </div>

        {/* Audio */}
        <div className="flex items-center gap-3 px-5 py-3 border-t border-cream2 bg-white shrink-0">
          <button 
            onClick={() => setIsAudioPlaying(!isAudioPlaying)}
            className="w-9 h-9 rounded-full bg-orange/10 hover:bg-orange/20 flex items-center justify-center text-orange transition-colors shrink-0"
          >
            {isAudioPlaying ? '⏸' : '▶'}
          </button>
          <div className="flex-1 flex items-center gap-2">
            {[...Array(5)].map((_, i) => (
              <span 
                key={i}
                className="block w-0.5 bg-orange rounded-full opacity-65"
                style={{ 
                  height: '20px',
                  animation: isAudioPlaying ? `waveAnimation 1.4s ease-in-out infinite ${i * 0.15}s` : 'none'
                }}
              />
            ))}
          </div>
          <span className="text-xs text-inkm shrink-0">Audio narration</span>
        </div>

        {/* Footer controls */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-cream2 bg-white shrink-0 gap-4">
          <button
            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
            className="px-4 py-2 rounded-lg text-sm font-bold text-inks hover:bg-cream2 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ← Previous
          </button>
          <div className="flex items-center gap-1.5">
            {[...Array(totalPages)].map((_, i) => (
              <div 
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  i === currentPage ? 'bg-orange scale-125' : 'bg-cream2'
                }`}
              />
            ))}
          </div>
          <div className="text-xs text-inkm">
            Page {currentPage + 1} of {totalPages}
          </div>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
            disabled={currentPage === totalPages - 1}
            className="px-4 py-2 rounded-lg text-sm font-bold text-inks hover:bg-cream2 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Next →
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes waveAnimation {
          0%, 100% {
            transform: scaleY(1);
            opacity: 0.65;
          }
          50% {
            transform: scaleY(0.3);
            opacity: 0.3;
          }
        }
      `}</style>
    </div>
  );
}
