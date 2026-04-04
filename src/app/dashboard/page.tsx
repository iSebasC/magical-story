'use client';

import { useEffect, useState } from 'react';
import { getCurrentUser, User as UserType } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { BookOpen } from 'lucide-react';
import { DocumentViewer } from '@/components/dashboard';
import { PlanType } from '@/types/stories';

interface Document {
  id: string;
  title: string;
  total_pages: number;
  created_at: string;
  access_level: 'free' | 'premium';
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserType | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<PlanType>('free');
  const [showDocViewer, setShowDocViewer] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<{ id: string; title: string } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      // 1. Obtener usuario actual
      const currentUser = await getCurrentUser();
      setUser(currentUser);

      // 2. Obtener documentos
      const { data, error } = await supabase
        .from('documents')
        .select('id, title, total_pages, created_at, access_level')
        .order('created_at', { ascending: false });

      if (data && !error) {
        setDocuments(data);
      }

      // 3. Obtener plan
      const storedPlan = localStorage.getItem('magicalstory_plan') as PlanType;
      if (storedPlan) {
        setPlan(storedPlan);
      } else {
        localStorage.setItem('magicalstory_plan', 'free');
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  const handleDocumentClick = (doc: Document) => {
    setSelectedDoc({ id: doc.id, title: doc.title });
    setShowDocViewer(true);
  };

  const firstName = user?.name?.split(' ')[0] || 'User';
  const totalBooks = documents.length;

  return (
    <div className="p-6 lg:p-8">
      {/* Welcome banner */}
      <div 
        className="rounded-2xl p-6 lg:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 mb-7 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg,#FF8C42 0%,#FF6B35 40%,#FF4D8D 100%)' }}
      >
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute -bottom-8 left-1/4 w-32 h-32 rounded-full bg-white/8 pointer-events-none" />
        <div className="relative z-10">
          <h1 className="font-display text-2xl lg:text-3xl font-bold text-white mb-1">
            Welcome back, <em className="font-normal">{firstName}!</em>
          </h1>
          <p className="text-white/80 text-sm">Ready to continue your adventure?</p>
        </div>
        {documents.length > 0 && (
          <div className="relative z-10 flex gap-2.5 flex-wrap">
            <button 
              onClick={() => handleDocumentClick(documents[0])}
              className="px-5 py-2.5 rounded-full text-sm font-bold text-white bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 transition-all"
            >
              📖 Continue reading
            </button>
          </div>
        )}
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3.5 mb-7">
        <div className="bg-white rounded-xl p-4 border border-cream2 flex items-center gap-3 hover:shadow-md hover:-translate-y-0.5 transition-all">
          <span className="text-3xl">📚</span>
          <div>
            <div className="text-xl font-display font-bold text-ink">{totalBooks}</div>
            <div className="text-[10px] text-inkm uppercase tracking-wider font-bold">Books</div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-cream2 flex items-center gap-3 hover:shadow-md hover:-translate-y-0.5 transition-all">
          <span className="text-3xl">⭐</span>
          <div>
            <div className="text-xl font-display font-bold text-ink">{plan === 'premium' ? 'Premium' : 'Free'}</div>
            <div className="text-[10px] text-inkm uppercase tracking-wider font-bold">Your Plan</div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-cream2 flex items-center gap-3 hover:shadow-md hover:-translate-y-0.5 transition-all">
          <span className="text-3xl">🎯</span>
          <div>
            <div className="text-xl font-display font-bold text-ink">0</div>
            <div className="text-[10px] text-inkm uppercase tracking-wider font-bold">Completed</div>
          </div>
        </div>
      </div>

      {/* Continue reading */}
      <div className="mb-2">
        <h2 className="font-display text-lg font-bold text-ink mb-0.5">Continue reading</h2>
        <p className="text-xs text-inkm">Pick up where you left off</p>
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-12 text-inkm">
          Loading books...
        </div>
      ) : documents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-inkm bg-cream2/50 rounded-xl border-2 border-dashed border-cream2 mb-7">
          <BookOpen className="w-10 h-10 mb-3 opacity-50" />
          <p className="text-sm">No books available yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 mb-7">
          {documents.slice(0, 2).map((doc) => (
            <div
              key={doc.id}
              onClick={() => handleDocumentClick(doc)}
              className="bg-white rounded-xl p-4 border border-cream2 flex items-center gap-4 cursor-pointer hover:border-orange hover:shadow-md hover:translate-x-1 transition-all"
            >
              <div className="w-16 h-16 bg-cream2 rounded-xl flex items-center justify-center text-3xl shrink-0">
                📖
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-sm font-bold text-ink mb-0.5 truncate">{doc.title}</h3>
                <p className="text-xs text-inkm mb-1.5">Page 1 of {doc.total_pages}</p>
                <div className="h-1.5 bg-cream2 rounded-full overflow-hidden">
                  <div className="h-full bg-orange rounded-full transition-all" style={{ width: '15%' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Featured stories */}
      <div className="mb-4">
        <h2 className="font-display text-lg font-bold text-ink mb-0.5">Featured stories</h2>
        <p className="text-xs text-inkm">Hand-picked for you</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {documents.slice(0, 4).map((doc, index) => {
          const gradients = [
            'linear-gradient(135deg, #FFE8E0 0%, #FFF0E0 100%)',
            'linear-gradient(135deg, #E0F7F5 0%, #E8F5FF 100%)',
            'linear-gradient(135deg, #EDE0FF 0%, #F5E8FF 100%)',
            'linear-gradient(135deg, #E8F4FF 0%, #D8EEFF 100%)'
          ];
          const emojis = ['🦁', '🧚', '🐉', '🚀', '🐢', '⭐', '🐙', '👻'];
          const isPremiumDoc = doc.access_level === 'premium';
          const isLocked = isPremiumDoc && plan === 'free';
          
          return (
            <div
              key={doc.id}
              onClick={() => !isLocked && handleDocumentClick(doc)}
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
