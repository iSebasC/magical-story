import Image from 'next/image';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-cream overflow-hidden">
      {/* LEFT PANEL — Decorativo (solo en desktop) */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 relative overflow-hidden p-10" style={{
        background: 'linear-gradient(150deg, #00ACC1 0%, #26C6DA 35%, #7E57C2 100%)'
      }}>
        
        {/* Dot grid */}
        <div 
          className="absolute inset-0 pointer-events-none" 
          style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,.12) 1.5px, transparent 1.5px)',
            backgroundSize: '28px 28px'
          }}
        />

        {/* Blobs decorativos */}
        <div 
          className="absolute -top-20 -right-20 w-96 h-96 rounded-full pointer-events-none" 
          style={{ background: 'radial-gradient(circle, rgba(255,230,109,.25) 0%, transparent 65%)' }}
        />
        <div 
          className="absolute -bottom-16 -left-16 w-80 h-80 rounded-full pointer-events-none" 
          style={{ background: 'radial-gradient(circle, rgba(168,213,226,.2) 0%, transparent 65%)' }}
        />
        <div 
          className="absolute top-1/2 left-1/3 w-48 h-48 rounded-full pointer-events-none" 
          style={{ background: 'radial-gradient(circle, rgba(255,107,53,.18) 0%, transparent 65%)' }}
        />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-2.5">
          <Image 
            src="/images/logo_storylessons.png" 
            alt="Magical Story Logo" 
            width={200} 
            height={60}
            quality={100}
            priority
            className="h-12 w-auto object-contain brightness-0 invert"
          />
        </div>

        {/* Ilustración central */}
        <div className="relative z-10 flex-1 flex items-center justify-center py-10">
          <div className="relative w-full max-w-xs">
            <svg viewBox="0 0 360 380" xmlns="http://www.w3.org/2000/svg" className="w-full">
              <defs>
                <radialGradient id="glow" cx="50%" cy="50%">
                  <stop offset="0%" stopColor="rgba(255,255,255,.25)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                </radialGradient>
              </defs>
              <circle cx="180" cy="190" r="140" fill="url(#glow)" />
              
              {/* Libro abierto */}
              <rect x="60" y="140" width="240" height="170" rx="16" fill="rgba(255,255,255,.15)" stroke="rgba(255,255,255,.25)" strokeWidth="1.5" />
              <rect x="65" y="145" width="115" height="160" rx="10" fill="rgba(255,255,255,.92)" />
              <rect x="180" y="145" width="115" height="160" rx="10" fill="rgba(255,255,255,.85)" />
              <rect x="174" y="145" width="12" height="160" rx="4" fill="rgba(255,107,53,.6)" />
              
              {/* Líneas página izquierda */}
              <rect x="78" y="162" width="88" height="5" rx="2.5" fill="rgba(0,188,212,.5)" />
              <rect x="78" y="173" width="75" height="4" rx="2" fill="rgba(200,190,180,.5)" />
              <rect x="78" y="183" width="80" height="4" rx="2" fill="rgba(200,190,180,.5)" />
              <rect x="78" y="193" width="65" height="4" rx="2" fill="rgba(200,190,180,.5)" />
              
              {/* Ilustración página izquierda */}
              <circle cx="110" cy="245" r="28" fill="rgba(255,213,79,.6)" />
              <circle cx="110" cy="236" r="14" fill="rgba(255,107,53,.7)" />
              <rect x="100" y="251" width="20" height="14" rx="4" fill="rgba(255,107,53,.7)" />
              
              {/* Página derecha */}
              <rect x="192" y="162" width="90" height="5" rx="2.5" fill="rgba(126,87,194,.4)" />
              <rect x="192" y="173" width="78" height="4" rx="2" fill="rgba(200,190,180,.4)" />
              <rect x="192" y="183" width="82" height="4" rx="2" fill="rgba(200,190,180,.4)" />
              <rect x="192" y="193" width="68" height="4" rx="2" fill="rgba(200,190,180,.4)" />
              <text x="225" y="255" fontSize="36" textAnchor="middle" fill="rgba(255,213,79,.8)">★</text>
              
              {/* Niño leyendo */}
              <ellipse cx="180" cy="130" rx="26" ry="20" fill="rgba(253,219,160,.9)" />
              <ellipse cx="165" cy="148" rx="15" ry="10" fill="rgba(0,188,212,.8)" style={{transform: 'rotate(20deg)', transformOrigin: '165px 148px'}} />
              <ellipse cx="195" cy="148" rx="15" ry="10" fill="rgba(0,188,212,.8)" style={{transform: 'rotate(-20deg)', transformOrigin: '195px 148px'}} />
              <ellipse cx="150" cy="122" rx="14" ry="8" fill="rgba(253,219,160,.9)" style={{transform: 'rotate(-20deg)', transformOrigin: '150px 122px'}} />
              <ellipse cx="210" cy="122" rx="14" ry="8" fill="rgba(253,219,160,.9)" style={{transform: 'rotate(20deg)', transformOrigin: '210px 122px'}} />
              <circle cx="180" cy="100" r="26" fill="rgba(253,219,160,1)" />
              <ellipse cx="180" cy="79" rx="24" ry="12" fill="rgba(123,92,58,.9)" />
              <circle cx="155" cy="100" r="5" fill="rgba(240,195,140,1)" />
              <ellipse cx="172" cy="102" rx="4" ry="3" fill="rgba(52,78,122,1)" />
              <ellipse cx="188" cy="102" rx="4" ry="3" fill="rgba(52,78,122,1)" />
              <path d="M173 112 Q180 118 187 112" stroke="rgba(52,78,122,.8)" strokeWidth="2" fill="none" strokeLinecap="round" />
              
              {/* Destellos */}
              <text x="48" y="105" fontSize="18" fill="rgba(255,213,79,.9)">✦</text>
              <text x="300" y="125" fontSize="14" fill="rgba(168,213,226,.9)">✦</text>
              <text x="80" y="330" fontSize="12" fill="rgba(184,159,212,.8)">✦</text>
              <text x="310" y="285" fontSize="16" fill="rgba(168,213,226,.7)">✦</text>
            </svg>

            {/* Tarjetas flotantes */}
            <div className="absolute -left-10 top-16 flex items-center gap-2.5 bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl px-3.5 py-2.5 text-white text-xs font-medium animate-[floatY_3.5s_ease-in-out_infinite]">
              <span className="text-base">🧚</span>
              <span>Fantasy tales</span>
            </div>
            <div className="absolute -right-8 top-1/2 flex items-center gap-2.5 bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl px-3.5 py-2.5 text-white text-xs font-medium animate-[floatY_3.5s_ease-in-out_infinite_1.2s]">
              <span className="text-base">🚀</span>
              <span>Adventure time!</span>
            </div>
            <div className="absolute left-1/4 -bottom-4 flex items-center gap-2.5 bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl px-3.5 py-2.5 text-white text-xs font-medium animate-[floatY_3.5s_ease-in-out_infinite_0.6s]">
              <span className="text-base">🏰</span>
              <span>Epic stories</span>
            </div>
          </div>
        </div>

        {/* Testimonio */}
        <div className="relative z-10">
          <blockquote className="font-display text-xl font-semibold text-white leading-snug mb-4">
            "My daughter now reads<br /><span className="text-sun">by choice</span>. Priceless."
          </blockquote>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-white/20 border border-white/35 flex items-center justify-center">
              👩
            </div>
            <span className="text-sm text-white/70">Sofia M. — Parent</span>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL — Contenido (children) */}
      {children}
    </div>
  );
}
