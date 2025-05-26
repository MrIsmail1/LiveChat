import { IsEmail } from 'class-validator';

export class PasswordForgetDto {
  @IsEmail()
  email: string;
}
