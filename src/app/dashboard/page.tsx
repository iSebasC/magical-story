'use client';

import { BookOpen, User, Mail, Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getCurrentUser, User as UserType } from '@/lib/auth';
import { PDFViewer } from '@/components/dashboard/PDFViewer';

export default function DashboardPage() {
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
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
                      Miembro desde {new Date(user.createdAt).toLocaleDateString('es-ES', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Badge */}
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/30 self-start">
              <span className="text-xs md:text-sm font-bold">Usuario Activo ✨</span>
            </div>
          </div>
        </div>
      )}

      {/* Visor de Documentos PDF */}
      <div className="bg-white rounded-2xl p-6 shadow-[0_4px_24px_rgba(52,78,122,.08)] border border-cream2">
        <h2 className="text-2xl font-display font-bold text-ink mb-4 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-orange" />
          Documentos y Páginas
        </h2>
        <PDFViewer 
          onFileSelect={(file) => {
            console.log('Archivo seleccionado:', file.name);
          }}
        />
      </div>
    </div>
  );
}
