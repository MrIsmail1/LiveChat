import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from 'src/types/auth';

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  firstName: string;
  @IsString()
  @MinLength(2)
  lastName: string;
  @IsEmail()
  email: string;
  @IsString()
  @MinLength(8)
  passwordHash: string;
  @IsEnum(UserRole)
  role: string;
  @IsBoolean()
  isVerified: boolean;
}
