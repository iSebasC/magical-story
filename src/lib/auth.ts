import { supabase } from './supabase'

export type UserRole = 'user' | 'admin' | 'premium';

export interface User {
  id: string;
  name?: string;
  email: string;
  role?: UserRole;
  createdAt?: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  message?: string;
  error?: any;
}

// Registrar nuevo usuario
export const register = async (
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: name
      }
    }
  });

  if (error) {
    return { success: false, message: error.message };
  }

  return {
    success: true,
    user: data.user ? {
      id: data.user.id,
      email: data.user.email!,
      name: data.user.user_metadata?.name,
      role: data.user.user_metadata?.role || 'user'
    } : undefined,
    message: 'Account created successfully!'
  };
};

// Login
export const login = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, message: error.message };
  }

  const userRole = data.user?.user_metadata?.role || 'user';
  console.log('🔐 LOGIN - Email:', data.user?.email);
  console.log('🔐 LOGIN - User Metadata:', data.user?.user_metadata);
  console.log('🔐 LOGIN - Role detectado:', userRole);

  return {
    success: true,
    user: data.user ? {
      id: data.user.id,
      email: data.user.email!,
      name: data.user.user_metadata?.name,
      role: userRole
    } : undefined,
    message: 'Signed in successfully!'
  };
};

// Logout
export const logout = async () => {
  await supabase.auth.signOut();
};

// Obtener usuario actual
export const getCurrentUser = async (): Promise<User | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  return {
    id: user.id,
    email: user.email!,
    name: user.user_metadata?.name,
    role: user.user_metadata?.role || 'user',
    createdAt: user.created_at
  };
};

// Verificar si el usuario es administrador
export const isAdmin = async (): Promise<boolean> => {
  const user = await getCurrentUser();
  return user?.role === 'admin';
};

// Verificar si está autenticado
export const isAuthenticated = async (): Promise<boolean> => {
  const { data: { session } } = await supabase.auth.getSession();
  return session !== null;
};
