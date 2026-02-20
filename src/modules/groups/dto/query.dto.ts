import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsInt, IsDateString, IsString } from 'class-validator';
import { GroupStatus, WeekDay } from '@prisma/client';

export class FindGroupsQueryDto {
  @ApiPropertyOptional({ enum: GroupStatus })
  @IsOptional()
  @IsEnum(GroupStatus)
  status?: GroupStatus;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsInt()
  teacher_id?: number;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsInt()
  room_id?: number;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsInt()
  course_id?: number;

  @ApiPropertyOptional({ example: '2026-03-01' })
  @IsOptional()
  @IsDateString()
  start_date?: string;

  @ApiPropertyOptional({ enum: WeekDay })
  @IsOptional()
  @IsEnum(WeekDay)
  week_day?: WeekDay;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  name?: string;
}
