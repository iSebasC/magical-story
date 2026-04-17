import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Log de todas las peticiones
  console.log(`📍 ${request.method} ${pathname}`);

  let response = NextResponse.next();
  response.headers.set('x-app-version', '1.0.0');

  // Proteger rutas de admin (solo verificar autenticación, el rol lo verifica el layout)
  if (pathname.startsWith('/admin')) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          request.cookies.set({ name, value: '', ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value: '', ...options });
        },
      },
    });

    const { data: { user } } = await supabase.auth.getUser();
    
    console.log('🛡️ MIDDLEWARE - Ruta:', pathname);
    console.log('🛡️ MIDDLEWARE - User:', user?.email);
    
    // Solo verificar si hay usuario autenticado
    if (!user) {
      console.log('❌ MIDDLEWARE - No hay usuario, redirect a /login');
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    console.log('✅ MIDDLEWARE - Usuario autenticado, permitir acceso');
  }

  return response;
}

// Configurar qué rutas activan el middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes handle their own auth)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
