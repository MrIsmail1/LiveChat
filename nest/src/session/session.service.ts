import { Injectable } from '@nestjs/common';
import { PrismaService } from './../prisma.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';

@Injectable()
export class SessionService {
  constructor(private prismaService: PrismaService) {}
  async createSession(dto: CreateSessionDto) {
    return await this.prismaService.session.create({
      data: {
        ...dto,
      },
    });
  }
  async findSessionById(id: string) {
    return await this.prismaService.session.findUnique({
      where: { id },
    });
  }
  async updateSession(id: string, data: UpdateSessionDto) {
    return await this.prismaService.session.update({
      where: { id },
      data: {
        ...data,
      },
    });
  }
  async deleteSessionByUserId(userId: string) {
    return await this.prismaService.session.deleteMany({
      where: { userId },
    });
  }
  async deleteSessionById(id: string) {
    return await this.prismaService.session.delete({
      where: { id },
    });
  }
}
