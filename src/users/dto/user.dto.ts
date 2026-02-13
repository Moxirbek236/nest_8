import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, MinLength, IsString } from 'class-validator';

export class UpdateUserDto {
   q
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @MinLength(6)
  password?: string;
}
