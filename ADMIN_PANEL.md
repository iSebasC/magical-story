# 👑 Panel de Administración - Magical Story

## 📋 Resumen

Panel de administración completo para gestionar historias, usuarios y configuraciones de la plataforma Magical Story.

---

## 🎯 Características

### 📊 Overview
- Estadísticas en tiempo real (historias, usuarios activos, lecturas, usuarios premium)
- Top 3 historias más leídas
- Gráfico de actividad semanal
- Registro de actividad reciente (signups, lecturas, upgrades)

### 📚 Stories
- **Subir PDF**: Drag & drop o click para subir historias
- **Gestión completa**: Editar título, emoji, categoría, nivel de acceso
- **Tabla dinámica**: Búsqueda y filtros (free/premium)
- **Control de acceso**: Free (todos los usuarios) o Premium (suscriptores)
- **Estadísticas**: Contador de lecturas por historia

### 👥 Users
- **Directorio de usuarios**: Vista completa de todos los usuarios registrados
- **Gestión de planes**: Toggle entre Free y Premium (con un click)
- **Búsqueda y filtros**: Por nombre, email o tipo de plan
- **Métricas**: Lecturas por usuario, fecha de registro
- **Contador en vivo**: Total de usuarios y premium

### ⚙️ Settings
- **Límite de plan Free**: Configurar máximo de historias para usuarios gratuitos
- **Precio Premium**: Ajustar precio de suscripción mensual
- **Admin Account**: Configurar email de administrador
- **Storage Usage**: Monitor de uso de almacenamiento en Supabase
- **Sign Out**: Cerrar sesión de forma segura

---

## 🔐 Sistema de Autenticación y Roles

### Roles Disponibles
- **`user`**: Usuario estándar (acceso solo a `/dashboard`)
- **`premium`**: Usuario con suscripción activa
- **`admin`**: Administrador (acceso a `/admin`)

### Protección de Rutas
El middleware automáticamente:
1. ✅ Verifica autenticación en `/dashboard` y `/admin`
2. ✅ Valida rol de administrador para `/admin/*`
3. ✅ Redirige usuarios no autorizados:
   - Sin sesión → `/login`
   - Sin rol admin en `/admin` → `/dashboard`

---

## 👤 Crear Usuario Administrador

Para acceder al panel de administración, necesitas crear un usuario con rol `admin` en Supabase.

### Opción 1: Supabase Dashboard (Recomendado)

1. **Ir a Supabase Dashboard**
   ```
   https://app.supabase.com/project/YOUR_PROJECT_ID
   ```

2. **Navegar a Authentication → Users**

3. **Crear nuevo usuario**:
   - Hacer click en "Add user" → "Create new user"
   - Email: `admin@magical.com`
   - Password: `Admin@123456` (cambiar después del primer login)
   - Auto Confirm User: ✅ Activar

4. **Agregar metadata de rol**:
   - Hacer click en el usuario recién creado
   - Ir a la pestaña "User Metadata"
   - Agregar el siguiente JSON:
   
   ```json
   {
     "role": "admin",
     "name": "Admin"
   }
   ```

5. **Guardar cambios**

### Opción 2: SQL Query en Supabase

1. **Ir a SQL Editor en Supabase Dashboard**

2. **Ejecutar el siguiente query** (reemplaza el email y password):

```sql
-- Insertar usuario admin en auth.users
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@magical.com',
  crypt('Admin@123456', gen_salt('bf')),
  NOW(),
  '{"role": "admin", "name": "Admin"}'::jsonb,
  NOW(),
  NOW(),
  '',
  ''
);
```

### Opción 3: Desde la Aplicación (Signup + Actualización Manual)

1. **Registrarse normalmente** en `/login`:
   - Name: Admin
   - Email: admin@magical.com
   - Password: Admin@123456

2. **Actualizar metadata en Supabase**:
   - Ir a Authentication → Users
   - Buscar el usuario recién creado
   - Agregar `"role": "admin"` en User Metadata

---

## 🚀 Acceso al Panel de Admin

### Credenciales de Administrador

**Email**: `admin@magical.com`  
**Password**: `Admin@123456`

### URLs del Panel

- **Login**: `http://localhost:3000/login`
- **Admin Dashboard**: `http://localhost:3000/admin`
- **Overview**: `http://localhost:3000/admin/overview`
- **Stories**: `http://localhost:3000/admin/stories`
- **Users**: `http://localhost:3000/admin/users`
- **Settings**: `http://localhost:3000/admin/settings`

---

## 🎨 Estructura de Archivos

```
src/
├── app/
│   └── admin/
│       ├── layout.tsx           # Layout con sidebar y topbar
│       ├── page.tsx              # Redirect a /admin/overview
│       ├── overview/
│       │   └── page.tsx          # Dashboard principal
│       ├── stories/
│       │   └── page.tsx          # Gestión de historias
│       ├── users/
│       │   └── page.tsx          # Gestión de usuarios
│       └── settings/
│           └── page.tsx          # Configuraciones
│
├── components/
│   └── admin/
│       ├── AdminSidebar.tsx      # Menú lateral
│       ├── AdminTopbar.tsx       # Barra superior
│       ├── StatsCard.tsx         # Cards de estadísticas
│       ├── TopStories.tsx        # Historias más leídas
│       ├── RecentActivity.tsx    # Actividad reciente
│       ├── StoriesUploadZone.tsx # Zona de upload
│       ├── UploadProgress.tsx    # Barra de progreso
│       ├── StoryForm.tsx         # Formulario de historia
│       ├── StoriesTable.tsx      # Tabla de historias
│       └── UsersTable.tsx        # Tabla de usuarios
│
├── lib/
│   └── auth.ts                   # Sistema de autenticación (+ roles)
│
└── middleware.ts                 # Protección de rutas
```

---

## 🔧 Configuración Técnica

### Middleware de Protección

El archivo `src/middleware.ts` protege automáticamente:

```typescript
// Rutas protegidas para usuarios autenticados
/dashboard/*  → Requiere sesión activa

// Rutas protegidas para administradores
/admin/*      → Requiere sesión activa + role: "admin"
```

### Sistema de Roles

En `src/lib/auth.ts`:

```typescript
export type UserRole = 'user' | 'admin' | 'premium';

export interface User {
  id: string;
  name?: string;
  email: string;
  role?: UserRole;
  createdAt?: string;
}

// Verificar si el usuario es admin
export const isAdmin = async (): Promise<boolean> => {
  const user = await getCurrentUser();
  return user?.role === 'admin';
};
```

---

## 📱 Responsive Design

- **Desktop**: Sidebar fijo, layout completo
- **Tablet**: Sidebar colapsable
- **Mobile**: Hamburger menu, overlay oscuro

---

## 🎯 Próximos Pasos

### Integración con Supabase Real

Actualmente, las páginas de admin usan datos mock. Para conectar datos reales:

1. **Crear tablas en Supabase**:
   ```sql
   -- Tabla de historias
   CREATE TABLE stories (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     title TEXT NOT NULL,
     emoji TEXT,
     access TEXT CHECK (access IN ('free', 'premium')),
     category TEXT,
     reads INTEGER DEFAULT 0,
     pages INTEGER DEFAULT 0,
     created_at TIMESTAMP DEFAULT NOW()
   );

   -- Actualizar tabla de users con campos adicionales
   ALTER TABLE auth.users 
   ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'free';
   ```

2. **Reemplazar datos mock** en las páginas con queries a Supabase

3. **Implementar upload real de PDF** usando Supabase Storage

---

## ⚠️ Seguridad

- ✅ Middleware verifica autenticación en cada request
- ✅ Validación de rol admin antes de mostrar contenido
- ✅ Passwords hasheados en Supabase Auth
- ✅ Signed URLs para storage (300s TTL)
- ⚠️ **IMPORTANTE**: Cambiar password de admin después del primer login

---

## 🐛 Troubleshooting

### "Access Denied" al entrar a /admin

**Causa**: Usuario no tiene rol `admin`  
**Solución**: Verificar en Supabase Dashboard → Authentication → Users → User Metadata que contenga `"role": "admin"`

### Redirección infinita en /admin

**Causa**: Middleware no puede leer session correctamente  
**Solución**: 
1. Verificar que `.env` tenga `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`
2. Hacer logout y login nuevamente
3. Limpiar cookies del navegador

### Usuario admin no puede hacer login

**Causa**: Email no confirmado en Supabase  
**Solución**: En Supabase Dashboard → Authentication → Users → Click en usuario → Marcar "Email confirmed"

---

## 📚 Recursos

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

## ✨ Características del Diseño

- **Color Palette**: Cream, Orange, Ink (consistente con landing page)
- **Tipografía**: Fraunces (display) + DM Sans (body)
- **Componentes**: Cards con hover effects, transiciones suaves
- **Iconos**: Emojis nativos (0 dependencias)
- **Animaciones**: fadeUp, smooth transitions, progress bars

---

**¡Panel de administración listo para usar!** 🎉

Para cualquier duda o mejora, consulta la documentación o contacta al equipo de desarrollo.
