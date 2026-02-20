import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDateString,
  IsEnum,
  IsArray,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { GroupStatus, WeekDay } from '@prisma/client';

export class CreateGroupDto {
  @ApiProperty({ example: 'NodeJS Evening Group' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'Backend NodeJS course group' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  course_id: number;

  @ApiProperty({ example: 2 })
  @Type(() => Number)
  @IsInt()
  teacher_id: number;

  @ApiProperty({ example: 3 })
  @Type(() => Number)
  @IsInt()
  room_id: number;

  @ApiProperty({
    example: '2026-03-01',
    description: 'Group start date',
  })
  @IsDateString()
  start_date: string;

  @ApiProperty({
    type: [String],
    enum: WeekDay,
    example: ['MONDAY', 'WEDNESDAY', 'FRIDAY'],
    description: 'Group lesson days',
  })
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
      return value.split(',').map((v) => v.trim());
    }
    return [];
  })
  @IsArray()
  @IsEnum(WeekDay, { each: true })
  week_day: WeekDay[];

  @ApiProperty({ example: '18:00' })
  @IsString()
  start_time: string;

  @ApiProperty({ example: 20 })
  @Type(() => Number)
  @IsInt()
  max_student: number;

  @ApiPropertyOptional({
    enum: GroupStatus,
    example: GroupStatus.planned,
  })
  @IsOptional()
  @IsEnum(GroupStatus)
  status?: GroupStatus;
}
