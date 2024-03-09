import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
export type User = any;

@Injectable()
export class UsersService {
  private readonly users = [
    {
      userId: 1,
      username: 'john',
      password: 'changeme',
    },
    {
      userId: 2,
      username: 'maria',
      password: 'guess',
    },
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }
  async findOneById(userId: number): Promise<User | undefined> {
    return this.users.find(user => user.userId === userId);
  }
  async createUser() {
    // Yk what to do
    // const salt = await bcrypt.genSalt();
    // const hash = await bcrypt.hash(password, salt);
  }
}