import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @HttpCode(HttpStatus.UNAUTHORIZED)
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
  @Get('email/verify/:verificationCode')
  verifyEmail(@Body('verificationCode') verificationCode: string) {
    return this.authService.verifyEmail(verificationCode);
  }
  @HttpCode(HttpStatus.OK)
  @Post('password/reset')
  resetPassword(
    @Body('password') password: string,
    @Body('verificationCode') verificationCode: string,
  ) {
    return this.authService.resetPassword({ password, verificationCode });
  }
  @HttpCode(HttpStatus.OK)
  @Post('password/forgot')
  forgotPassword(@Body('email') email: string) {
    return this.authService.sendPasswordResetEmail(email);
  }
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logout(@Body('sessionId') sessionId: string) {
    return this.authService.logout(sessionId);
  }
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  refresh(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshUserAccessToken(refreshToken);
  }
}
