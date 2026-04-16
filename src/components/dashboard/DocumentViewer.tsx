'use client';

import { useEffect, useState, useRef } from 'react';
import { X, Maximize, Minimize, BookOpen, FileText, Inbox } from 'lucide-react';
import { supabase } from '@/lib/supabase';

/**
 * DocumentViewer con Experiencia de Libro Real + Protecciones Visuales
 * 
 * 📖 EXPERIENCIA DE LIBRO:
 * - Primera página (portada) se muestra sola
 * - Páginas intermedias se muestran en pares (spread/doble página)
 * - Última página se muestra sola (si total es impar)
 * - Botón fullscreen para maximizar visualización
 * - Navegación por "vistas" en lugar de páginas individuales
 * 
 * ✅ QUÉ SÍ PROTEGE:
 * - Bloquea clic derecho (onContextMenu) sobre imagen y contenedor
 * - Evita arrastrar imagen (draggable={false}, onDragStart prevented)
 * - Impide selección de texto/imagen (user-select: none)
 * - Capa overlay transparente dificulta inspección directa
 * - pointer-events: none en imagen evita interacciones directas
 * - URLs temporales (signed URLs con expiración) dificultan acceso persistente
 * 
 * ❌ QUÉ NO PROTEGE (limitaciones de frontend):
 * - DevTools: usuario puede inspeccionar DOM y copiar URL firmada
 * - Screenshot/captura de pantalla (Print Screen, herramientas OS)
 * - Extensiones de navegador que capturan contenido
 * - Network tab: usuario puede ver requests y copiar URLs
 * - Deshabilitar JavaScript para saltarse eventos
 * 
 * 💡 POR QUÉ FRONTEND SOLO DIFICULTA:
 * - Todo lo que se renderiza en navegador es accesible al usuario
 * - JavaScript se ejecuta en cliente (controlado por usuario)
 * - DOM es inspeccionable por naturaleza de HTML
 * - Solo backend puede restringir ACCESO real a recursos
 * 
 * 🔐 REFUERZOS RECOMENDADOS (Backend):
 * - Watermarks dinámicos con user_id embebidos en imagen
 * - Rate limiting en generación de signed URLs
 * - Logs de acceso para detectar patrones sospechosos
 * - URLs de un solo uso (invalidar tras primera carga)
 * - Segmentación de imágenes (renderizar tiles en vez de imagen completa)
 * - DRM si el caso de negocio lo justifica
 */

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

/**
 * Spread representa una "vista" del libro:
 * - Puede contener 1 página (portada o última página)
 * - O 2 páginas (spread/doble página)
 */
interface BookSpread {
  leftPageIndex: number | null;  // null si no hay página izquierda
  rightPageIndex: number | null; // null si no hay página derecha
}

export function DocumentViewer({ isOpen, documentId, documentTitle, onClose }: DocumentViewerProps) {
  const [pages, setPages] = useState<Page[]>([]);
  const [currentSpreadIndex, setCurrentSpreadIndex] = useState(0);
  const [spreads, setSpreads] = useState<BookSpread[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageUrls, setPageUrls] = useState<{ [key: number]: string }>({});
  const [audioActive, setAudioActive] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const viewerRef = useRef<HTMLDivElement>(null);

  /**
   * Calcula los "spreads" (vistas) del libro:
   * - Spread 0: solo página 0 (portada)
   * - Spreads intermedios: páginas en pares (1-2, 3-4, ...)
   * - Último spread: solo última página si el total es impar
   */
  const calculateSpreads = (totalPages: number): BookSpread[] => {
    if (totalPages === 0) return [];
    if (totalPages === 1) return [{ leftPageIndex: null, rightPageIndex: 0 }];

    const result: BookSpread[] = [];
    
    // Spread 0: portada sola
    result.push({ leftPageIndex: null, rightPageIndex: 0 });
    
    // Spreads intermedios: páginas en pares
    for (let i = 1; i < totalPages - 1; i += 2) {
      result.push({
        leftPageIndex: i,
        rightPageIndex: i + 1 < totalPages ? i + 1 : null
      });
    }
    
    // Si la última página no se incluyó en los pares, agregarla sola
    const lastPageIndex = totalPages - 1;
    const lastSpread = result[result.length - 1];
    if (lastSpread.rightPageIndex !== lastPageIndex && lastSpread.leftPageIndex !== lastPageIndex) {
      result.push({ leftPageIndex: null, rightPageIndex: lastPageIndex });
    }
    
    return result;
  };

  useEffect(() => {
    if (isOpen && documentId) {
      setCurrentSpreadIndex(0);
      setAudioActive(false);
      document.body.style.overflow = 'hidden';
      loadPages();
    } else {
      document.body.style.overflow = '';
      setIsFullscreen(false);
    }

    return () => {
      document.body.style.overflow = '';
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    };
  }, [isOpen, documentId]);

  // Calcular spreads cuando las páginas se cargan
  useEffect(() => {
    if (pages.length > 0) {
      const calculatedSpreads = calculateSpreads(pages.length);
      setSpreads(calculatedSpreads);
    }
  }, [pages]);

  // Cargar URLs de las páginas del spread actual
  useEffect(() => {
    if (spreads.length > 0 && currentSpreadIndex < spreads.length) {
      const spread = spreads[currentSpreadIndex];
      if (spread.leftPageIndex !== null) loadPageUrl(spread.leftPageIndex);
      if (spread.rightPageIndex !== null) loadPageUrl(spread.rightPageIndex);
    }
  }, [currentSpreadIndex, spreads]);

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
    
    // If it's already a full HTTP(S) URL, use it directly instead of creating a signed URL
    if (cleanPath.startsWith('http://') || cleanPath.startsWith('https://')) {
      setPageUrls(prev => ({ ...prev, [pageIndex]: cleanPath }));
      return;
    }
    
    try {
      if (cleanPath.includes('/storage/v1/object/public/pdfs/') || cleanPath.includes('/storage/v1/object/pdfs/')) {
        const urlParts = cleanPath.split('/pdfs/');
        if (urlParts.length > 1) cleanPath = urlParts[1];
      }
    } catch (e) {}
    
    if (cleanPath.startsWith('/')) cleanPath = cleanPath.substring(1);
    if (cleanPath.startsWith('pdfs/')) cleanPath = cleanPath.substring(5);
    cleanPath = decodeURIComponent(cleanPath);

    const { data, error } = await supabase.storage
      .from('pdfs')
      .createSignedUrl(cleanPath, 300);
    
    if (error) {
      console.error('Error creating signed URL for path:', cleanPath, error);
    }
    
    if (data?.signedUrl) {
      setPageUrls(prev => ({ ...prev, [pageIndex]: data.signedUrl }));
    }
  };

  const handlePrev = () => {
    if (currentSpreadIndex > 0) {
      setCurrentSpreadIndex(currentSpreadIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentSpreadIndex < spreads.length - 1) {
      setCurrentSpreadIndex(currentSpreadIndex + 1);
    }
  };

  const toggleFullscreen = async () => {
    if (!viewerRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await viewerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.error('Error toggling fullscreen:', err);
    }
  };

  // Detectar cambios de fullscreen (Escape key, etc)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Detectar cambios de fullscreen (Escape key, etc)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Navegación por teclado
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape' && !document.fullscreenElement) onClose();
      if (e.key === 'f' || e.key === 'F') toggleFullscreen();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentSpreadIndex, spreads.length]);

  if (!isOpen || !documentId) return null;

  const currentSpread = spreads[currentSpreadIndex];
  const hasLeftPage = currentSpread?.leftPageIndex !== null;
  const hasRightPage = currentSpread?.rightPageIndex !== null;
  const isSinglePage = !hasLeftPage || !hasRightPage;

  return (
    <div 
      ref={viewerRef}
      className={`fixed inset-0 bg-ink/95 z-500 flex items-center justify-center ${isFullscreen ? 'p-0' : 'p-4'}`}
    >
      <div className="bg-white rounded-3xl w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cream2">
          <h2 className="font-display text-lg font-bold text-ink truncate pr-4">
            {documentTitle}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleFullscreen}
              className="w-8 h-8 rounded-full bg-cream2 hover:bg-cream3 transition-colors flex items-center justify-center shrink-0"
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              title={isFullscreen ? 'Exit fullscreen (F)' : 'Enter fullscreen (F)'}
            >
              {isFullscreen ? (
                <Minimize className="w-4 h-4 text-ink" />
              ) : (
                <Maximize className="w-4 h-4 text-ink" />
              )}
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-cream2 hover:bg-cream3 transition-colors flex items-center justify-center shrink-0"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-ink" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full py-20">
              <div className="text-center">
                <BookOpen className="w-10 h-10 text-inkm mx-auto mb-4" />
                <p className="text-inkm">Loading pages...</p>
              </div>
            </div>
          ) : pages.length === 0 ? (
            <div className="flex items-center justify-center h-full py-20">
              <div className="text-center">
                <Inbox className="w-10 h-10 text-inkm mx-auto mb-4" />
                <p className="text-inkm">No pages found</p>
              </div>
            </div>
          ) : (
            <div className="p-6">
              {/* Book Spread Container - Protected */}
              <div 
                className={`bg-cream2/30 rounded-2xl mb-6 min-h-[500px] flex items-center justify-center gap-2 relative protected-content ${
                  isSinglePage ? '' : 'book-spread'
                }`}
                onContextMenu={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
              >
                {currentSpread ? (
                  <>
                    {/* Página Izquierda */}
                    {hasLeftPage && (
                      <div className="flex-1 flex items-center justify-center relative max-w-[48%]">
                        {pageUrls[currentSpread.leftPageIndex!] ? (
                          <>
                            <img 
                              src={pageUrls[currentSpread.leftPageIndex!]} 
                              alt={`Page ${currentSpread.leftPageIndex! + 1}`}
                              className="max-w-full h-auto rounded-xl shadow-lg"
                              draggable={false}
                              onContextMenu={(e) => e.preventDefault()}
                            />
                            <div 
                              className="protection-overlay"
                              onContextMenu={(e) => e.preventDefault()}
                              onDragStart={(e) => e.preventDefault()}
                              aria-hidden="true"
                            />
                          </>
                        ) : (
                          <div className="text-center py-20">
                            <FileText className="w-10 h-10 text-inkm mx-auto mb-2" />
                            <p className="text-xs text-inkm">Loading...</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Divisor central para spreads dobles */}
                    {!isSinglePage && (
                      <div className="w-0.5 h-[80%] bg-ink/10 rounded-full" />
                    )}

                    {/* Página Derecha */}
                    {hasRightPage && (
                      <div className={`flex-1 flex items-center justify-center relative ${isSinglePage ? '' : 'max-w-[48%]'}`}>
                        {pageUrls[currentSpread.rightPageIndex!] ? (
                          <>
                            <img 
                              src={pageUrls[currentSpread.rightPageIndex!]} 
                              alt={`Page ${currentSpread.rightPageIndex! + 1}`}
                              className="max-w-full h-auto rounded-xl shadow-lg"
                              draggable={false}
                              onContextMenu={(e) => e.preventDefault()}
                            />
                            <div 
                              className="protection-overlay"
                              onContextMenu={(e) => e.preventDefault()}
                              onDragStart={(e) => e.preventDefault()}
                              aria-hidden="true"
                            />
                          </>
                        ) : (
                          <div className="text-center py-20">
                            <FileText className="w-10 h-10 text-inkm mx-auto mb-2" />
                            <p className="text-xs text-inkm">Loading...</p>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-20">
                    <FileText className="w-12 h-12 text-inkm mx-auto mb-4" />
                    <p className="text-inkm">Loading spread...</p>
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

        {/* Footer - Navigation */}
        {!loading && spreads.length > 0 && (
          <div className="px-6 py-4 border-t border-cream2 flex items-center justify-between">
            <button
              onClick={handlePrev}
              disabled={currentSpreadIndex === 0}
              className="px-4 py-2 rounded-full text-sm font-medium bg-cream2 text-ink hover:bg-cream3 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              ← Prev
            </button>

            <div className="flex flex-col items-center gap-2">
              {/* Indicador de spread */}
              <div className="flex gap-1">
                {spreads.map((_, index) => (
                  <div
                    key={index}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      index === currentSpreadIndex ? 'bg-orange w-6' : 'bg-cream3'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-inkm font-medium">
                {isSinglePage ? (
                  <>Page {hasRightPage ? currentSpread.rightPageIndex! + 1 : currentSpread.leftPageIndex! + 1} of {pages.length}</>
                ) : (
                  <>Pages {currentSpread.leftPageIndex! + 1}-{currentSpread.rightPageIndex! + 1} of {pages.length}</>
                )}
              </span>
            </div>

            <button
              onClick={handleNext}
              disabled={currentSpreadIndex === spreads.length - 1}
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
