import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Status, StudentStatus } from '@prisma/client';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'John' })
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({ example: 'Doe' })
  @IsNotEmpty()
  last_name: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: '+1234567890' })
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: '123 Main St' })
  @IsNotEmpty()
  address: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  photo: string;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class QueryAuthDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Filter by first name' })
  first_name?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Filter by last name' })
  last_name?: string;

  @IsOptional()
  @IsEmail()
  @ApiPropertyOptional({ description: 'Filter by email' })
  email?: string;


  @IsOptional()
  @IsEnum(Status)
  @ApiPropertyOptional({ enum: Status, description: "Filter by course status" })
  status?: Status;
}
