import { userRepository } from './user.repository';
import type { User, CreateUserDto } from './user.types';

class UserService {
  async getAllUsers(): Promise<User[]> {
    return await userRepository.findAll();
  }

  async getUserById(id: string): Promise<User | undefined> {
    return await userRepository.findById(id);
  }

  async createUser(data: CreateUserDto): Promise<User> {
    // Aquí podrías agregar validaciones
    if (!data.email || !data.name) {
      throw new Error('Email y nombre son requeridos');
    }
    return await userRepository.create(data);
  }

  async deleteUser(id: string): Promise<boolean> {
    return await userRepository.delete(id);
  }
}

export const userService = new UserService();
