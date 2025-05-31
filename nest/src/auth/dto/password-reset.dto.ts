import { IsString } from 'class-validator';

export class PasswordResetDto {
  @IsString()
  password: string;

  @IsString()
  verificationCode: string;
}
