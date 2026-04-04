'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { PageDots } from '@/components/ui';

interface DocumentViewerProps {
  isOpen: boolean;
  documentId: string | null;
  documentTitle: string;
  onClose: () => void;
}

interface Page {
  id: string;
  page_number: number;
  image_path: string;
}

export function DocumentViewer({ isOpen, documentId, documentTitle, onClose }: DocumentViewerProps) {
  const [pages, setPages] = useState<Page[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pageUrls, setPageUrls] = useState<{ [key: number]: string }>({});
  const [audioActive, setAudioActive] = useState(false);

  useEffect(() => {
    if (isOpen && documentId) {
      setCurrentPage(0);
      setAudioActive(false);
      document.body.style.overflow = 'hidden';
      loadPages();
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, documentId]);

  useEffect(() => {
    if (pages.length > 0) {
      loadPageUrl(currentPage);
    }
  }, [currentPage, pages]);

  const loadPages = async () => {
    if (!documentId) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('document_pages')
      .select('*')
      .eq('document_id', documentId)
      .order('page_number', { ascending: true });

    if (data && !error) {
      setPages(data as Page[]);
    }
    setLoading(false);
  };

  const loadPageUrl = async (pageIndex: number) => {
    if (pageUrls[pageIndex]) return;

    const page = pages[pageIndex];
    if (!page) return;

    let cleanPath = page.image_path || '';
    
    try {
      if (cleanPath.includes('/storage/v1/object/public/pdfs/') || cleanPath.includes('/storage/v1/object/pdfs/')) {
        const urlParts = cleanPath.split('/pdfs/');
        if (urlParts.length > 1) cleanPath = urlParts[1];
      }
    } catch (e) {}
    
    if (cleanPath.startsWith('/')) cleanPath = cleanPath.substring(1);
    if (cleanPath.startsWith('pdfs/')) cleanPath = cleanPath.substring(5);
    cleanPath = decodeURIComponent(cleanPath);

    const { data } = await supabase.storage
      .from('pdfs')
      .createSignedUrl(cleanPath, 300);
    
    if (data?.signedUrl) {
      setPageUrls(prev => ({ ...prev, [pageIndex]: data.signedUrl }));
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentPage, pages.length]);

  if (!isOpen || !documentId) return null;

  return (
    <div className="fixed inset-0 bg-ink/95 z-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cream2">
          <h2 className="font-display text-lg font-bold text-ink truncate pr-4">
            {documentTitle}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-cream2 hover:bg-cream3 transition-colors flex items-center justify-center shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-ink" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full py-20">
              <div className="text-center">
                <div className="text-4xl mb-4">📖</div>
                <p className="text-inkm">Loading pages...</p>
              </div>
            </div>
          ) : pages.length === 0 ? (
            <div className="flex items-center justify-center h-full py-20">
              <div className="text-center">
                <div className="text-4xl mb-4">📭</div>
                <p className="text-inkm">No pages found</p>
              </div>
            </div>
          ) : (
            <div className="p-6">
              {/* Page Image */}
              <div className="bg-cream2/30 rounded-2xl mb-6 min-h-[400px] flex items-center justify-center">
                {pageUrls[currentPage] ? (
                  <img 
                    src={pageUrls[currentPage]} 
                    alt={`Page ${currentPage + 1}`}
                    className="max-w-full h-auto rounded-xl"
                  />
                ) : (
                  <div className="text-center py-20">
                    <div className="text-5xl mb-4">📄</div>
                    <p className="text-inkm">Loading page...</p>
                  </div>
                )}
              </div>

              {/* Audio Toggle (simulated) */}
              <div className="flex items-center justify-center gap-3 mb-6">
                <button
                  onClick={() => setAudioActive(!audioActive)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all ${
                    audioActive
                      ? 'bg-orange text-white'
                      : 'bg-cream2 text-ink hover:bg-cream3'
                  }`}
                >
                  {audioActive ? '🔊' : '🔇'}
                  <span>{audioActive ? 'Audio On' : 'Audio Off'}</span>
                </button>
                {audioActive && (
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-1 bg-orange rounded-full animate-wave"
                        style={{
                          height: '20px',
                          animationDelay: `${i * 0.1}s`,
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!loading && pages.length > 0 && (
          <div className="px-6 py-4 border-t border-cream2 flex items-center justify-between">
            <button
              onClick={handlePrev}
              disabled={currentPage === 0}
              className="px-4 py-2 rounded-full text-sm font-medium bg-cream2 text-ink hover:bg-cream3 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              ← Prev
            </button>

            <div className="flex flex-col items-center gap-2">
              <PageDots total={pages.length} current={currentPage} />
              <span className="text-xs text-inkm font-medium">
                Page {currentPage + 1} of {pages.length}
              </span>
            </div>

            <button
              onClick={handleNext}
              disabled={currentPage === pages.length - 1}
              className="px-4 py-2 rounded-full text-sm font-medium bg-cream2 text-ink hover:bg-cream3 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
