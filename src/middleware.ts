import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Log de todas las peticiones
  console.log(`📍 ${request.method} ${pathname}`);

  // Agregar headers CORS si es necesario
  const response = NextResponse.next();
  response.headers.set('x-app-version', '1.0.0');
  
  // Ejemplo: proteger rutas del dashboard
  if (pathname.startsWith('/dashboard')) {
    // Aquí verificarías autenticación
    // const token = request.cookies.get('token')
    // if (!token) {
    //   return NextResponse.redirect(new URL('/login', request.url))
    // }
  }

  return response;
}

// Configurar qué rutas activan el middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
