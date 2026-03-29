# 📘 Guía: Cómo Crear APIs en Este Proyecto

> Basado en la API `/api/users` existente en el proyecto

---

## 🏗️ Arquitectura

Este proyecto usa **arquitectura en capas**:

```
1. Types        → Define interfaces y DTOs
2. Repository   → Acceso a datos (CRUD)
3. Service      → Lógica de negocio y validaciones
4. API Route    → Maneja HTTP requests/responses
```

---

## 🚀 Paso a Paso para Crear una API

### **Paso 1: Definir los Types** 📝

📁 `src/modules/user/user.types.ts`

```typescript
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

export interface CreateUserDto {
  name: string;
  email: string;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
}
```

---

### **Paso 2: Crear el Repository** 💾

📁 `src/modules/user/user.repository.ts`

```typescript
import type { User, CreateUserDto } from './user.types';

class UserRepository {
  private users: User[] = [];

  async findAll(): Promise<User[]> {
    return this.users;
  }

  async create(data: CreateUserDto): Promise<User> {
    const newUser: User = {
      id: (this.users.length + 1).toString(),
      ...data,
      createdAt: new Date()
    };
    this.users.push(newUser);
    return newUser;
  }
}

export const userRepository = new UserRepository();
```

---

### **Paso 3: Crear el Service** 🔧

📁 `src/modules/user/user.service.ts`

```typescript
import { userRepository } from './user.repository';
import type { User, CreateUserDto } from './user.types';

class UserService {
  async getAllUsers(): Promise<User[]> {
    return await userRepository.findAll();
  }

  async createUser(data: CreateUserDto): Promise<User> {
    // Validaciones de negocio
    if (!data.email || !data.name) {
      throw new Error('Email y nombre son requeridos');
    }
    return await userRepository.create(data);
  }
}

export const userService = new UserService();
```

---

### **Paso 4: Crear la API Route** 🌐

📁 `src/app/api/users/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/modules/user/user.service';

export async function GET(request: NextRequest) {
  try {
    const users = await userService.getAllUsers();
    return NextResponse.json({
      success: true,
      data: users,
      message: 'Usuarios obtenidos correctamente'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error al obtener usuarios' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newUser = await userService.createUser(body);
    return NextResponse.json({
      success: true,
      data: newUser,
      message: 'Usuario creado correctamente'
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error al crear usuario' },
      { status: 400 }
    );
  }
}
```

---

## 📁 Estructura de Archivos

```
src/
 ├── modules/
 │   └── user/
 │       ├── user.types.ts        ← Paso 1
 │       ├── user.repository.ts   ← Paso 2
 │       └── user.service.ts      ← Paso 3
 │
 └── app/
     └── api/
         └── users/
             └── route.ts         ← Paso 4
```

---

## 📌 Convenciones

1. **Exports**: `export const userService = new UserService()`
2. **Imports**: Usar `@/modules/...` (alias `@/`)
3. **Async**: Todos los métodos async/await
4. **Respuestas**:
   ```typescript
   { success: true, data, message }      // Éxito
   { success: false, error }             // Error
   ```
5. **HTTP Codes**: 200, 201, 400, 500
6. **Try/Catch**: Siempre en route handlers

---

## ✅ Checklist

- [ ] Crear `{modulo}.types.ts`
- [ ] Crear `{modulo}.repository.ts`
- [ ] Crear `{modulo}.service.ts`
- [ ] Crear `api/{endpoint}/route.ts`
- [ ] Try/catch en handlers
- [ ] Status codes correctos
