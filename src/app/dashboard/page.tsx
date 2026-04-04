'use client';

import { BookOpen, User, Mail, Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCurrentUser, User as UserType } from '@/lib/auth';


import { supabase } from '@/lib/supabase';

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
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Tarjeta de Usuario Principal */}
      {user && (
        <div className="bg-linear-to-r from-orange to-oranged rounded-2xl p-6 md:p-8 shadow-[0_4px_24px_rgba(255,107,53,.25)] text-white">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex items-center gap-4 md:gap-6">
              {/* Avatar */}
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/30 shrink-0">
                <User className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </div>

              {/* Info del Usuario */}
              <div>
                <h2 className="text-2xl md:text-3xl font-display font-bold mb-2">
                  {user.name}
                </h2>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-white/90">
                    <Mail className="w-4 h-4 shrink-0" />
                    <span className="text-xs md:text-sm font-medium break-all">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/90">
                    <Calendar className="w-4 h-4 shrink-0" />
                    <span className="text-xs md:text-sm font-medium">
                      Registered {user.createdAt ? new Date(user.createdAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'Recientemente'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Badge */}
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/30 self-start">
              <span className="text-xs md:text-sm font-bold">User Active ✨</span>
            </div>
          </div>
        </div>
      )}

      {/* Mis Libros - Grilla de 4 Columnas */}
      <div className="bg-white rounded-2xl p-6 shadow-[0_4px_24px_rgba(52,78,122,.08)] border border-cream2">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-display font-bold text-ink flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-orange" />
            Mis Libros
          </h2>
          <button className="text-sm font-semibold text-orange hover:text-oranged transition-colors">
            Ver todos →
          </button>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-12 text-inkm">
            Cargando libros...
          </div>
        ) : documents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-inkm bg-cream2/50 rounded-xl border-2 border-dashed border-cream2">
            <BookOpen className="w-10 h-10 mb-3 opacity-50" />
            <p>No hay libros disponibles aún.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {documents.map((doc) => (
              <Link key={doc.id} href={`/dashboard/read/${doc.id}`}>
                <div 
                  className="group bg-white border-2 border-cream2 rounded-xl p-5 hover:border-orange/30 hover:shadow-[0_8px_24px_rgba(255,107,53,.12)] transition-all duration-300 cursor-pointer flex flex-col h-full relative overflow-hidden"
                >
                  {/* Etiqueta Premium / Free */}
                  <div className={`absolute top-0 right-0 px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-bl-xl ${
                    doc.access_level === 'premium' ? 'bg-[#9333EA] text-white' : 'bg-[#4CAF8A] text-white'
                  }`}>
                    {doc.access_level}
                  </div>

                  <div className="w-14 h-14 bg-cream2 rounded-xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 group-hover:bg-orange/10 transition-all duration-300 mt-2">
                    📖
                  </div>
                  <h3 className="font-display font-bold text-ink text-lg mb-2 group-hover:text-orange transition-colors line-clamp-2">
                    {doc.title}
                  </h3>
                  
                  {/* Detalles extra */}
                  <div className="mt-auto pt-4 space-y-2">
                    <div className="flex items-center justify-between text-xs text-inkm font-medium">
                      <span>Páginas</span>
                      <span className="text-ink">{doc.total_pages || 0}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-inkm font-medium">
                      <span>Agregado</span>
                      <span className="text-ink">
                        {new Date(doc.created_at).toLocaleDateString('es-ES')}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
