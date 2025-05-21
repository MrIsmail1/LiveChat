import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { SessionModule } from './session/session.module';
import { UsersModule } from './users/users.module';
import { VerificationCodeModule } from './verification-code/verification-code.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [UsersModule, SessionModule, VerificationCodeModule, AuthModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
