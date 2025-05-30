import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { UserProfile } from 'src/types/user';
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
  async findById(id: string): Promise<UserProfile | null> {
    return await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
        passwordHash: false,
      },
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
  async findAllUsers(userId: string): Promise<UserProfile[]> {
    return await this.prisma.user.findMany({
      where: {
        id: {
          not: userId,
        },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        passwordHash: false,
      },
    });
  }
}
