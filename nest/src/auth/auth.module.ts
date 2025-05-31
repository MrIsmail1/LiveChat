import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SessionModule } from 'src/session/session.module';
import { UsersModule } from 'src/users/users.module';
import { VerificationCodeModule } from 'src/verification-code/verification-code.module';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    SessionModule,
    VerificationCodeModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard],
  exports: [AuthService],
})
export class AuthModule {}
