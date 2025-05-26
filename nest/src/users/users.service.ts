import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }
  async findById(id: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { id },
    });
  }
  async createUser(dto: CreateUserDto): Promise<User> {
    return await this.prisma.user.create({
      data: {
        ...dto,
        role: dto.role ?? 'USER',
      },
    });
  }
  async updateUser(id: string, data: UpdateUserDto): Promise<User> {
    return await this.prisma.user.update({
      where: { id },
      data: {
        ...data,
      },
    });
  }
  async deleteUser(id: string): Promise<User> {
    return await this.prisma.user.delete({
      where: { id },
    });
  }
  async findAllUsers(): Promise<User[]> {
    return await this.prisma.user.findMany();
  }
}
