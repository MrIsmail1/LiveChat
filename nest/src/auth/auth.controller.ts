import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
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
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
  @HttpCode(HttpStatus.OK)
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
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
  logout(@Body('sessionId') sessionId: string) {
    return this.authService.logout(sessionId);
  }
  @HttpCode(HttpStatus.OK)
  @Get('refresh')
  refresh(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshUserAccessToken(refreshToken);
  }
}
