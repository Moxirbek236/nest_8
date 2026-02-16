import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, MinLength, IsString } from 'class-validator';

export class UpdateUserDto {
  
  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @MinLength(6)
  password?: string;
}
