import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateVerificationCodeDto } from './dto/create-verification-code.dto';

@Injectable()
export class VerificationCodeService {
  constructor(private prismaService: PrismaService) {}

  async createVerificationCode(dto: CreateVerificationCodeDto) {
    return await this.prismaService.verificationCode.create({
      data: {
        ...dto,
      },
    });
  }
  async findVerificationCodeById(id: string, type: string, expiresAt: Date) {
    return await this.prismaService.verificationCode.findUnique({
      where: { id, type, expiresAt: { gte: expiresAt } },
    });
  }
  async deleteVerificationCode(id: string) {
    return await this.prismaService.verificationCode.delete({
      where: { id },
    });
  }
  async countVerificationCodes(userId: string, type: string, expiresAt: Date) {
    return await this.prismaService.verificationCode.count({
      where: {
        userId,
        type,
        expiresAt: { gte: expiresAt },
      },
    });
  }
}
