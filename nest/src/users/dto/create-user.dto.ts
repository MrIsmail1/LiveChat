import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

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
  @IsString()
  @IsOptional()
  role?: string;
  @IsBoolean()
  isVerified: boolean;
}
