import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsString } from 'class-validator';

export class CreateSessionDto {
  @IsString()
  userId: string;

  @IsString()
  @IsOptional()
  userAgent?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  expiresAt?: Date;
}
