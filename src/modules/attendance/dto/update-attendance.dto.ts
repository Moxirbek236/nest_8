import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class UpdateAttendanceDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  lesson_id?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  student_id?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isPresent?: boolean;
}
