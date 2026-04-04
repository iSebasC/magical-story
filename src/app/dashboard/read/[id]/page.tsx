'use client';

import { useEffect, useState, use } from 'react';
import { supabase } from '@/lib/supabase';
import { ChevronLeft, ChevronRight, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface Page {
  id: string;
  page_number: number;
  image_path: string;
  url?: string;
}

export default function BookReaderPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const [pages, setPages] = useState<Page[]>([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPageUrl, setCurrentPageUrl] = useState<string | null>(null);
  const [loadingPage, setLoadingPage] = useState(false);

  useEffect(() => {
    const fetchPages = async () => {
      // 1. Obtener páginas del documento
      const { data: dbPages, error } = await supabase
        .from('document_pages')
        .select('*')
        .eq('document_id', unwrappedParams.id)
        .order('page_number', { ascending: true });

      if (error || !dbPages || dbPages.length === 0) {
        setLoading(false);
        return;
      }

      setPages(dbPages as Page[]);
      setLoading(false);
    };

    fetchPages();
  }, [unwrappedParams.id]);

  useEffect(() => {
    const loadCurrentPageUrl = async () => {
      if (pages.length === 0) return;
      
      setLoadingPage(true);
      const page = pages[currentPageIndex];
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

      console.log(`Solicitando Signed URL para: "${cleanPath}" (Original: "${page.image_path}") por 60s`);

      const { data } = await supabase.storage
        .from('pdfs')
        .createSignedUrl(cleanPath, 60);
      
      setCurrentPageUrl(data?.signedUrl || null);
      setLoadingPage(false);
    };

    loadCurrentPageUrl();
  }, [currentPageIndex, pages]);

  const nextPage = () => {
    if (currentPageIndex < pages.length - 1) {
      setCurrentPageIndex(prev => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(prev => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-orange animate-spin mb-4" />
        <p className="text-inkm font-medium">Abriendo libro mágico...</p>
      </div>
    );
  }

  if (pages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="text-4xl mb-4">📖</div>
        <h2 className="text-2xl font-bold text-ink mb-2">Libro vacío</h2>
        <p className="text-inkm mb-6">No se encontraron páginas para este libro.</p>
        <Link 
          href="/dashboard"
          className="bg-orange hover:bg-oranged text-white px-6 py-2.5 rounded-xl font-semibold transition-colors"
        >
          Volver a mi biblioteca
        </Link>
      </div>
    );
  }

  const currentPage = pages[currentPageIndex];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-white px-6 py-4 rounded-2xl shadow-[0_4px_24px_rgba(52,78,122,.08)] border border-cream2">
        <Link 
          href="/dashboard"
          className="flex items-center gap-2 text-inkm hover:text-orange transition-colors font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver
        </Link>
        <div className="text-sm font-bold text-ink bg-cream px-4 py-1.5 rounded-full">
          Página {currentPageIndex + 1} de {pages.length}
        </div>
      </div>

      {/* Lector Pagina por Pagina */}
      <div className="relative bg-white rounded-3xl p-4 md:p-8 shadow-[0_8px_32px_rgba(52,78,122,.12)] border-2 border-cream2 flex items-center justify-center min-h-[60vh]">
        {/* Controles Izquierda */}
        <button 
          onClick={prevPage}
          disabled={currentPageIndex === 0}
          className="absolute left-2 md:left-6 z-10 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg border border-cream2 text-inkm hover:text-orange hover:scale-110 disabled:opacity-30 disabled:hover:scale-100 disabled:hover:text-inkm transition-all"
        >
          <ChevronLeft className="w-6 h-6 -ml-1" />
        </button>

        {/* Imagen de la Página */}
        <div className="w-full max-w-2xl px-12 relative flex items-center justify-center">
          {loadingPage ? (
            <div className="flex flex-col items-center justify-center">
              <Loader2 className="w-10 h-10 text-orange animate-spin mb-4" />
              <p className="text-inkm font-medium">Cargando página...</p>
            </div>
          ) : currentPageUrl ? (
            currentPage.image_path?.toLowerCase().includes('.pdf') || currentPageUrl.toLowerCase().includes('.pdf') ? (
              <iframe 
                src={`${currentPageUrl}#zoom=FitH`}
                className="w-full h-[70vh] border-0 rounded-lg shadow-md"
                title={`Página ${currentPageIndex + 1}`}
              />
            ) : (
              <img 
                src={currentPageUrl} 
                alt={`Página ${currentPageIndex + 1}`}
                className="max-h-[70vh] w-auto object-contain rounded-lg shadow-md"
              />
            )
          ) : (
            <div className="text-red-500 font-medium">Error al cargar la página</div>
          )}
        </div>

        {/* Controles Derecha */}
        <button 
          onClick={nextPage}
          disabled={currentPageIndex === pages.length - 1}
          className="absolute right-2 md:right-6 z-10 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg border border-cream2 text-inkm hover:text-orange hover:scale-110 disabled:opacity-30 disabled:hover:scale-100 disabled:hover:text-inkm transition-all"
        >
          <ChevronRight className="w-6 h-6 -mr-1" />
        </button>
      </div>
    </div>
  );
}
