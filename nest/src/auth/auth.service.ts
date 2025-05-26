import { MailerService } from '@nestjs-modules/mailer';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt-ts';
import VerificationCodeType from 'src/constants/verificationCodeType';
import { SessionService } from 'src/session/session.service';
import {
  LoginPayload,
  RefreshPayload,
  RegisterPayload,
  ResetPasswordPayload,
  SignOptionsAndSecret,
} from 'src/types/auth';

import { UsersService } from 'src/users/users.service';
import {
  fiveMinutesAgo,
  ONE_DAY_MS,
  oneHourFromNow,
  oneYearFromNow,
  thirtyDaysFromNow,
} from 'src/utils/date';
import { VerificationCodeService } from 'src/verification-code/verification-code.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private verificationCodeService: VerificationCodeService,
    private sessionService: SessionService,
    private mailerService: MailerService,
  ) {}
  private accessTokenSignOptions: SignOptionsAndSecret = {
    expiresIn: '15m',
    secret: process.env.JWT_SECRET || 'defaultSecret',
  };

  private refreshTokenSignOptions: SignOptionsAndSecret = {
    expiresIn: '30d',
    secret: process.env.JWT_SECRET || 'defaultSecret',
  };
  async register({
    firstName,
    lastName,
    email,
    password,
    role,
    userAgent,
  }: RegisterPayload) {
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }
    const passwordHash = await hash(password, 10);
    if (role !== 'CLIENT' && role !== 'COACH') {
      throw new BadRequestException('Invalid role');
    }
    const user = await this.usersService.createUser({
      firstName,
      lastName,
      email,
      passwordHash,
      role,
      isVerified: false,
    });
    const verificationCode =
      await this.verificationCodeService.createVerificationCode({
        userId: user.id,
        type: VerificationCodeType.EmailVerification,
        expiresAt: oneYearFromNow(),
      });

    const url = `${process.env.APP_ORIGIN}/auth/email/verify/${verificationCode.id}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Verify your email',
      template: 'verify-email',
      context: {
        name: `${firstName} ${lastName}`,
        url,
      },
    });

    const session = await this.sessionService.createSession({
      userId: user.id,
      userAgent,
    });

    const refreshToken = await this.jwtService.signAsync(
      {
        sessionId: session.id,
      },
      this.refreshTokenSignOptions,
    );

    const accessToken = await this.jwtService.signAsync(
      {
        userId: user.id,
        sessionId: session.id,
      },
      this.accessTokenSignOptions,
    );
    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    };
  }

  async login({ email, password, userAgent }: LoginPayload) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordValid = await compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const session = await this.sessionService.createSession({
      userId: user.id,
      userAgent,
    });

    const refreshToken = await this.jwtService.signAsync(
      {
        sessionId: session.id,
      },
      this.refreshTokenSignOptions,
    );

    const accessToken = await this.jwtService.signAsync(
      {
        userId: user.id,
        sessionId: session.id,
      },
      this.accessTokenSignOptions,
    );
    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    };
  }

  async verifyEmail(verificationCodeId: string) {
    const verificationCode =
      await this.verificationCodeService.findVerificationCodeById(
        verificationCodeId,
        VerificationCodeType.EmailVerification,
        new Date(),
      );
    if (!verificationCode) {
      throw new NotFoundException('Invalid or expired verification code');
    }
    const user = await this.usersService.findById(verificationCode.userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    await this.usersService.updateUser(user.id, {
      isVerified: true,
    });
    await this.verificationCodeService.deleteVerificationCode(
      verificationCode.id,
    );
    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    };
  }

  async refreshUserAccessToken(refreshToken: string) {
    const { sessionId } = await this.jwtService.verifyAsync<RefreshPayload>(
      refreshToken,
      {
        secret: this.refreshTokenSignOptions.secret,
      },
    );
    const session = await this.sessionService.findSessionById(sessionId);
    const now = Date.now();

    if (!session || !session.expiresAt || session.expiresAt.getTime() < now) {
      throw new UnauthorizedException('Session expired');
    }

    const expires = session.expiresAt.getTime();
    const sessionNeedsRefresh = expires - now <= ONE_DAY_MS;

    if (sessionNeedsRefresh) {
      session.expiresAt = thirtyDaysFromNow();
      await this.sessionService.updateSession(session.id, {
        expiresAt: session.expiresAt,
      });
    }

    const newRefreshToken = sessionNeedsRefresh
      ? await this.jwtService.signAsync(
          { sessionId: session.id },
          this.refreshTokenSignOptions,
        )
      : undefined;

    const accessToken = await this.jwtService.signAsync(
      { userId: session.userId, sessionId: session.id },
      this.accessTokenSignOptions,
    );

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  async sendPasswordResetEmail(email: string) {
    try {
      const user = await this.usersService.findByEmail(email);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const count = await this.verificationCodeService.countVerificationCodes(
        user.id,
        VerificationCodeType.PasswordReset,
        fiveMinutesAgo(),
      );
      if (count >= 1) {
        throw new UnauthorizedException('Too many requests, try again later');
      }
      const expiresAt = oneHourFromNow();
      const verificationCode =
        await this.verificationCodeService.createVerificationCode({
          userId: user.id,
          type: VerificationCodeType.PasswordReset,
          expiresAt: expiresAt,
        });
      const url = `${process.env.APP_ORIGIN}/password/reset?code=${verificationCode.id}&exp=${expiresAt.getTime()}`;

      await this.mailerService.sendMail({
        to: email,
        subject: 'Reset your password',
        template: 'password-reset',
        context: {
          name: `${user.firstName} ${user.lastName}`,
          url,
        },
      });

      return {
        message:
          'If an account exists with this email, a password reset email has been sent',
      };
    } catch (error: unknown) {
      console.log('SendPasswordResetError:', (error as Error).message);
      return {};
    }
  }

  async resetPassword({ password, verificationCode }: ResetPasswordPayload) {
    const validCode =
      await this.verificationCodeService.findVerificationCodeById(
        verificationCode,
        VerificationCodeType.PasswordReset,
        new Date(),
      );
    if (!validCode) {
      throw new UnauthorizedException('Invalid or expired verification code');
    }
    const user = await this.usersService.findById(validCode.userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const passwordHash = await hash(password, 10);
    await this.usersService.updateUser(user.id, {
      passwordHash,
    });
    await this.verificationCodeService.deleteVerificationCode(validCode.id);
    await this.sessionService.deleteSessionByUserId(user.id);
    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    };
  }
  async logout(sessionId: string) {
    const session = await this.sessionService.findSessionById(sessionId);
    if (!session) {
      throw new NotFoundException('Session not found');
    }
    await this.sessionService.deleteSessionById(session.id);
    return {
      message: 'Logged out successfully',
    };
  }
}
