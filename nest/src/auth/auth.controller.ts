import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { fifteenMinutesFromNow, thirtyDaysFromNow } from 'src/utils/date';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { PasswordForgetDto } from './dto/password-forget.dto';
import { PasswordResetDto } from './dto/password-reset.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken, user } =
      await this.authService.login(loginDto);
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      expires: fifteenMinutesFromNow(),
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      expires: thirtyDaysFromNow(),
      path: '/auth/refresh',
    });
    return { user };
  }
  @HttpCode(HttpStatus.OK)
  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken, user } =
      await this.authService.register(registerDto);
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      expires: fifteenMinutesFromNow(),
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      expires: thirtyDaysFromNow(),
      path: '/auth/refresh',
    });
    return { user };
  }
  @HttpCode(HttpStatus.OK)
  @Post('password/reset')
  resetPassword(@Body('password') passwordResetDto: PasswordResetDto) {
    return this.authService.resetPassword(passwordResetDto);
  }
  @HttpCode(HttpStatus.OK)
  @Post('password/forgot')
  forgotPassword(@Body() passwordForgetDto: PasswordForgetDto) {
    return this.authService.sendPasswordResetEmail(passwordForgetDto.email);
  }
  @HttpCode(HttpStatus.OK)
  @Get('email/verify/:verificationCode')
  verifyEmail(@Param('verificationCode') verificationCode: string) {
    return this.authService.verifyEmail(verificationCode);
  }
  @HttpCode(HttpStatus.OK)
  @Get('logout')
  async logout(
    @Body('sessionId') sessionId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(sessionId);
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken', { path: '/auth/refresh' });
    return { message: 'Logged out successfully' };
  }
  @HttpCode(HttpStatus.OK)
  @Get('refresh')
  async refresh(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {
    const oldRefreshToken = req.cookies.refreshToken;
    if (!oldRefreshToken) {
      throw new UnauthorizedException('No refresh token provided');
    }
    const { accessToken, refreshToken: newRefresh } =
      await this.authService.refreshUserAccessToken(oldRefreshToken);
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      expires: fifteenMinutesFromNow(),
    });
    res.cookie('refreshToken', newRefresh, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      expires: thirtyDaysFromNow(),
      path: '/auth/refresh',
    });
    return { accessToken };
  }
}
