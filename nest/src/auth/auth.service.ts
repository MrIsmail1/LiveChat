import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import VerificationCodeType from 'src/constants/verificationCodeType';
import { SessionService } from 'src/session/session.service';
import {
  LoginPayload,
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
    userAgent,
  }: RegisterPayload) {
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await this.usersService.createUser({
      firstName,
      lastName,
      email,
      passwordHash,
      role: 'USER',
      isVerified: false,
    });
    const verificationCode =
      await this.verificationCodeService.createVerificationCode({
        userId: user.id,
        type: VerificationCodeType.EmailVerification,
        expiresAt: oneYearFromNow(),
      });

    const url = `${process.env.APP_ORIGIN}/verify-email/${verificationCode.id}`;

    //TODO: send email with verification code

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
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
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
    const { payload } = await this.jwtService.verifyAsync(refreshToken, {
      secret: this.refreshTokenSignOptions.secret,
    });
    const session = await this.sessionService.findSessionById(
      payload.sessionId,
    );
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

      //TODO: send email with verification code

      return {
        url,
      };
    } catch (error) {
      console.log('SendPasswordResetError:', error.message);
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
    const passwordHash = await bcrypt.hash(password, 10);
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
}
