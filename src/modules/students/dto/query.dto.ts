import { ApiPropertyOptional } from '@nestjs/swagger';
import { StudentStatus } from '@prisma/client';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';

export class QueryStudentDto {
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
  @IsEnum(StudentStatus)
  @ApiPropertyOptional({ description: 'Filter by status', enum: StudentStatus })
  status?: StudentStatus;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({ description: 'Filter by birth date' })
  birth_date?: string;
}
