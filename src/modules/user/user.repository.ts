import type { User, CreateUserDto } from './user.types';

class UserRepository {
  private users: User[] = [
    {
      id: '1',
      name: 'Juan Pérez',
      email: 'juan@ejemplo.com',
      createdAt: new Date()
    },
    {
      id: '2',
      name: 'María García',
      email: 'maria@ejemplo.com',
      createdAt: new Date()
    }
  ];

  async findAll(): Promise<User[]> {
    return this.users;
  }

  async findById(id: string): Promise<User | undefined> {
    return this.users.find(user => user.id === id);
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

  async delete(id: string): Promise<boolean> {
    const index = this.users.findIndex(user => user.id === id);
    if (index === -1) return false;
    this.users.splice(index, 1);
    return true;
  }
}

export const userRepository = new UserRepository();
