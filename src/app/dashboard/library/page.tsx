'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { DocumentViewer } from '@/components/dashboard';
import { PlanType } from '@/types/stories';

interface Document {
  id: string;
  title: string;
  total_pages: number;
  created_at: string;
  access_level: 'free' | 'premium';
}

type FilterType = 'all' | 'free' | 'premium';

export default function LibraryPage() {
  const [plan, setPlan] = useState<PlanType>('free');
  const [currentFilter, setCurrentFilter] = useState<FilterType>('all');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
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
        .select('id, title, total_pages, created_at, access_level')
        .order('created_at', { ascending: false });

      if (data && !error) {
        setDocuments(data);
        setFilteredDocuments(data);
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
    { value: 'free', label: '🟢 Free' },
    { value: 'premium', label: '⭐ Premium' }
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
        <h2 className="font-display text-xl font-bold text-ink mb-0.5">Story Library</h2>
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredDocuments.map((doc, index) => {
            const isPremiumDoc = doc.access_level === 'premium';
            const isLocked = isPremiumDoc && plan === 'free';
            
            return (
              <div
                key={doc.id}
                onClick={() => handleDocumentClick(doc)}
                className={`relative rounded-2xl overflow-hidden border-[1.5px] transition-all ${
                  isLocked 
                    ? 'border-cream2 cursor-not-allowed' 
                    : 'border-cream2 hover:-translate-y-1 hover:shadow-lg hover:border-cream3 cursor-pointer'
                }`}
              >
                {/* Background area with emoji */}
                <div 
                  className="h-32 flex items-center justify-center text-5xl relative"
                  style={{ background: gradients[index % gradients.length] }}
                >
                  <span className="relative z-10">{emojis[index % emojis.length]}</span>
                  {isLocked && (
                    <div className="absolute inset-0 bg-ink/20 backdrop-blur-[2px] flex items-center justify-center">
                      <span className="text-4xl">🔒</span>
                    </div>
                  )}
                </div>

                {/* Badge in top corner */}
                <div className={`absolute top-2 right-2 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${
                  isPremiumDoc ? 'bg-orange text-white' : 'bg-teal text-white'
                }`}>
                  {isPremiumDoc ? 'Premium' : 'Free'}
                </div>

                {/* Content */}
                <div className="bg-white p-3.5">
                  <h3 className="font-display text-sm font-bold text-ink mb-1 leading-snug line-clamp-2">
                    {doc.title}
                  </h3>
                  <p className="text-[10px] text-inkm mb-2.5">
                    {doc.total_pages} pages
                  </p>
                  
                  {/* Button */}
                  {isLocked ? (
                    <button className="w-full py-2 rounded-lg text-xs font-bold bg-cream2/60 text-inkm cursor-not-allowed flex items-center justify-center gap-1.5">
                      <span>🔒</span> Premium
                    </button>
                  ) : (
                    <button className="w-full py-2 rounded-lg text-xs font-bold text-white bg-orange hover:bg-oranged transition-colors flex items-center justify-center gap-1.5">
                      <span>📖</span> Read
                    </button>
                  )}
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
