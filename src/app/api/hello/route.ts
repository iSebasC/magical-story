import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: '¡Hola Mundo! 🌎',
    timestamp: new Date().toISOString(),
    status: 'API funcionando correctamente'
  });
}
