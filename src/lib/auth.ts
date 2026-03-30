// Autenticación simulada con localStorage

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  message?: string;
}

// Clave para almacenar usuarios registrados
const USERS_KEY = 'magicalstory_users';
const AUTH_USER_KEY = 'magicalstory_auth_user';

// Obtener todos los usuarios registrados
const getUsers = (): User[] => {
  if (typeof window === 'undefined') return [];
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

// Guardar usuarios
const saveUsers = (users: User[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// Registrar nuevo usuario
export const register = async (
  name: string,
  email: string,
  _password: string
): Promise<AuthResponse> => {
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simular delay de red

  const users = getUsers();
  
  // Verificar si el email ya existe
  if (users.find(u => u.email === email)) {
    return {
      success: false,
      message: 'Email already registered'
    };
  }

  // Crear nuevo usuario
  const newUser: User = {
    id: crypto.randomUUID(),
    name,
    email,
    createdAt: new Date().toISOString()
  };

  // Guardar usuario
  users.push(newUser);
  saveUsers(users);

  // Guardar en localStorage (simulando sesión)
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUser));

  return {
    success: true,
    user: newUser,
    message: 'Account created successfully!'
  };
};

// Login
export const login = async (
  email: string,
  _password: string
): Promise<AuthResponse> => {
  await new Promise(resolve => setTimeout(resolve, 800)); // Simular delay de red

  const users = getUsers();
  const user = users.find(u => u.email === email);

  if (!user) {
    return {
      success: false,
      message: 'Email or password incorrect'
    };
  }

  // Guardar en localStorage (simulando sesión)
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));

  return {
    success: true,
    user,
    message: 'Signed in successfully!'
  };
};

// Logout
export const logout = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AUTH_USER_KEY);
};

// Obtener usuario actual
export const getCurrentUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem(AUTH_USER_KEY);
  return user ? JSON.parse(user) : null;
};

// Verificar si está autenticado
export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null;
};
