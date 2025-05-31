import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { VerificationCodeService } from './verification-code.service';

@Module({
  imports: [],
  controllers: [],
  providers: [VerificationCodeService, PrismaService],
  exports: [VerificationCodeService],
})
export class VerificationCodeModule {}
