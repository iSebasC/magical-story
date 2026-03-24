# 🚀 API Endpoints

## Hola Mundo
```bash
GET http://localhost:3000/api/hello
```

**Respuesta:**
```json
{
  "message": "¡Hola Mundo! 🌎",
  "timestamp": "2026-03-24T...",
  "status": "API funcionando correctamente"
}
```

---

## Users API

### Obtener todos los usuarios
```bash
GET http://localhost:3000/api/users
```

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "Juan Pérez",
      "email": "juan@ejemplo.com",
      "createdAt": "2026-03-24T..."
    }
  ],
  "message": "Usuarios obtenidos correctamente"
}
```

### Crear usuario
```bash
POST http://localhost:3000/api/users
Content-Type: application/json

{
  "name": "Pedro López",
  "email": "pedro@ejemplo.com"
}
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "id": "3",
    "name": "Pedro López",
    "email": "pedro@ejemplo.com",
    "createdAt": "2026-03-24T..."
  },
  "message": "Usuario creado correctamente"
}
```

---

## 📁 Estructura del Proyecto

```
src/
 ├── app/
 │   ├── api/
 │   │   ├── hello/
 │   │   │   └── route.ts         # API Hola Mundo
 │   │   └── users/
 │   │       └── route.ts         # CRUD de usuarios
 │   ├── (auth)/
 │   │   ├── layout.tsx           # Layout de autenticación
 │   │   └── login/
 │   │       └── page.tsx         # Página de login
 │   ├── dashboard/
 │   │   └── page.tsx             # Dashboard
 │   ├── layout.tsx
 │   └── page.tsx
 │
 ├── modules/                     # 👈 Lógica de negocio
 │   └── user/
 │       ├── user.service.ts      # Capa de servicios
 │       ├── user.repository.ts   # Capa de datos
 │       └── user.types.ts        # Tipos TypeScript
 │
 ├── lib/                         # 👈 Helpers, db
 │   └── db.ts                    # Configuración DB
 │
 └── middleware.ts                # Middleware global
```

---

## 🧪 Probar las APIs

### Con curl:
```bash
# Hola Mundo
curl http://localhost:3000/api/hello

# Listar usuarios
curl http://localhost:3000/api/users

# Crear usuario
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Carlos","email":"carlos@ejemplo.com"}'
```

### Con Thunder Client / Postman:
1. Instala la extensión Thunder Client en VS Code
2. Importa las rutas desde arriba
3. Prueba cada endpoint

---

## 🌐 Rutas Frontend

- `/` - Home
- `/login` - Inicio de sesión
- `/dashboard` - Panel de administración

---

## 📦 Próximos Pasos

1. Conectar base de datos real (Prisma/MongoDB)
2. Implementar autenticación (NextAuth.js)
3. Agregar validación de datos (Zod)
4. Tests unitarios (Jest/Vitest)
