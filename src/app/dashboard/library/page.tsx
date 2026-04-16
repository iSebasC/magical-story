'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { DocumentViewer } from '@/components/dashboard';
import { PlanType } from '@/types/stories';
import { BookOpen, Lock, Star, CircleDot, Download, Paperclip } from 'lucide-react';

interface Document {
  id: string;
  title: string;
  description?: string | null;
  cover_image?: string | null;
  banner_color?: string | null;
  total_pages: number;
  created_at: string;
  access_level: 'free' | 'premium';
}

interface Resource {
  id: string;
  document_id: string;
  name: string;
  file_path: string;
}

type FilterType = 'all' | 'free' | 'premium';

export default function LibraryPage() {
  const [plan, setPlan] = useState<PlanType>('free');
  const [currentFilter, setCurrentFilter] = useState<FilterType>('all');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [resourcesByDoc, setResourcesByDoc] = useState<Record<string, Resource[]>>({});
  const [showDocViewer, setShowDocViewer] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<{ id: string; title: string } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      // 1. Obtener plan
      const storedPlan = localStorage.getItem('magicalstory_plan') as PlanType;
      if (storedPlan) {
        setPlan(storedPlan);
      }

      // 2. Obtener documentos
      const { data, error } = await supabase
        .from('documents')
        .select('id, title, description, cover_image, banner_color, total_pages, created_at, access_level')
        .order('created_at', { ascending: false });

      if (data && !error) {
        setDocuments(data);
        setFilteredDocuments(data);

        // Fetch resource counts
        const { data: resData } = await supabase
          .from('document_resources')
          .select('id, document_id, name, file_path');
        if (resData) {
          const grouped: Record<string, Resource[]> = {};
          for (const r of resData) {
            if (!grouped[r.document_id]) grouped[r.document_id] = [];
            grouped[r.document_id].push(r);
          }
          setResourcesByDoc(grouped);
        }
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (currentFilter === 'all') {
      setFilteredDocuments(documents);
    } else if (currentFilter === 'free') {
      setFilteredDocuments(documents.filter(d => d.access_level === 'free'));
    } else if (currentFilter === 'premium') {
      setFilteredDocuments(documents.filter(d => d.access_level === 'premium'));
    }
  }, [currentFilter, documents]);

  const handleFilterClick = (filter: FilterType) => {
    setCurrentFilter(filter);
  };

  const handleDocumentClick = (doc: Document) => {
    const isPremiumDoc = doc.access_level === 'premium';
    const isLocked = isPremiumDoc && plan === 'free';

    if (!isLocked) {
      setSelectedDoc({ id: doc.id, title: doc.title });
      setShowDocViewer(true);
    }
  };

  const filters: { value: FilterType; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'free', label: 'Free' },
    { value: 'premium', label: 'Premium' }
  ];

  const gradients = [
    'linear-gradient(135deg, #FFE8E0 0%, #FFF0E0 100%)',
    'linear-gradient(135deg, #E0F7F5 0%, #E8F5FF 100%)',
    'linear-gradient(135deg, #EDE0FF 0%, #F5E8FF 100%)',
    'linear-gradient(135deg, #E8F4FF 0%, #D8EEFF 100%)',
    'linear-gradient(135deg, #E0FFE8 0%, #D8F5E0 100%)',
    'linear-gradient(135deg, #FFF8E0 0%, #FFF0CC 100%)',
    'linear-gradient(135deg, #E0F0FF 0%, #D0E8FF 100%)',
    'linear-gradient(135deg, #F0F0FF 0%, #E8E8FF 100%)'
  ];

  const emojis = ['📖', '📚', '📕', '📗', '📘', '📙', '📔', '📓'];

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-5">
        <h2 className="font-display text-lg text-ink mb-0.5 tracking-wide">Story Library</h2>
        <p className="text-sm text-inkm">Explore all available stories</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-5">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => handleFilterClick(filter.value)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold border-2 transition-all ${
              currentFilter === filter.value
                ? 'border-orange bg-orange text-white'
                : 'border-cream2 bg-white text-inkm hover:border-cream3'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="flex items-center justify-center py-12 text-inkm">
          Loading library...
        </div>
      ) : filteredDocuments.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-inkm text-sm">No books found with this filter</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredDocuments.map((doc, index) => {
            const isPremiumDoc = doc.access_level === 'premium';
            const isLocked = isPremiumDoc && plan === 'free';
            const isReversed = index % 2 === 1;
            const docResources = resourcesByDoc[doc.id] || [];
            
            return (
              <div
                key={doc.id}
                className={`relative rounded-2xl overflow-hidden border-[1.5px] transition-all flex ${isReversed ? 'flex-row-reverse' : 'flex-row'} ${
                  isLocked 
                    ? 'border-cream2' 
                    : 'border-cream2 hover:-translate-y-1 hover:shadow-lg hover:border-cream3'
                }`}
                style={{ background: doc.banner_color || gradients[index % gradients.length] }}
              >
                {/* Cover image side */}
                <div 
                  className="w-1/3 sm:w-48 flex-shrink-0 flex items-center justify-center text-5xl relative min-h-[140px]"
                >
                  {doc.cover_image ? (
                    <img src={doc.cover_image} alt={doc.title} className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <span className="relative z-10">{emojis[index % emojis.length]}</span>
                  )}
                  {isLocked && (
                    <div className="absolute inset-0 bg-ink/20 backdrop-blur-[2px] flex items-center justify-center">
                      <Lock className="w-8 h-8 text-white" />
                    </div>
                  )}
                  {/* Badge */}
                  <div className={`absolute top-2 ${isReversed ? 'right-2' : 'left-2'} px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider rounded-full shadow-sm ${
                    isPremiumDoc ? 'bg-orange text-white' : 'bg-teal text-white'
                  }`}>
                    {isPremiumDoc ? 'Premium' : 'Free'}
                  </div>
                </div>

                {/* Content side */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display text-base sm:text-lg text-ink mb-1.5 leading-snug line-clamp-2 tracking-wide font-bold">
                      {doc.title}
                    </h3>
                    {doc.description && (
                      <p className="text-sm text-inkm mb-2.5 line-clamp-3">
                        {doc.description}
                      </p>
                    )}
                    <p className="text-xs sm:text-sm text-inkm mb-3 font-medium">
                      {doc.total_pages} pages
                    </p>
                  </div>
                  
                  {/* Actions row */}
                  <div className="mt-auto flex items-center gap-2 flex-wrap">
                    {isLocked ? (
                      <button className="py-2 px-4 rounded-lg text-xs font-bold bg-cream2/60 text-inkm cursor-not-allowed flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5" /> Premium
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleDocumentClick(doc)}
                        className="py-2 px-4 rounded-lg text-xs font-bold text-white bg-orange hover:bg-oranged transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <BookOpen className="w-3.5 h-3.5" /> Read
                      </button>
                    )}
                    {docResources.map((res) => (
                      <a
                        key={res.id}
                        href={res.file_path}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="py-2 px-3 rounded-lg text-xs font-bold text-orange bg-orange/10 hover:bg-orange/20 transition-colors flex items-center gap-1.5 cursor-pointer"
                        title={res.name}
                      >
                        <Download className="w-3.5 h-3.5" /> {res.name.length > 20 ? res.name.slice(0, 17) + '…' : res.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Document Viewer Modal */}
      <DocumentViewer 
        isOpen={showDocViewer}
        documentId={selectedDoc?.id || null}
        documentTitle={selectedDoc?.title || ''}
        onClose={() => setShowDocViewer(false)}
      />
    </div>
  );
}
