// Configuración de base de datos
// Por ahora simulada, pero aquí conectarías Prisma, MongoDB, etc.

export const db = {
  connected: true,
  
  async connect() {
    console.log('📦 Base de datos conectada');
    return true;
  },

  async disconnect() {
    console.log('📦 Base de datos desconectada');
    return true;
  }
};

// Ejemplo de cómo usarías Prisma:
// import { PrismaClient } from '@prisma/client'
// export const db = new PrismaClient()
