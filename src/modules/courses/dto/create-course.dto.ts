import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { CourseLevel } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCourseDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    enum: CourseLevel,
    enumName: 'CourseLevel',
    example: CourseLevel.beginner,
  })
  @IsEnum(CourseLevel)
  level: CourseLevel;

  @IsString()
  description: string;

  @Type(() => Number)
  @IsNumber()
  price: number;

  @Type(() => Number)
  @IsNumber()
  duration_month: number;

  @Type(() => Number)
  @IsNumber()
  duration_hours: number;
}