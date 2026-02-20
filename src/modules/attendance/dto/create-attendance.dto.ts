import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsBoolean } from 'class-validator';

export class CreateAttendanceDto {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  lesson_id: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  student_id: number;

  @ApiProperty()
  @IsBoolean()
  isPresent: boolean;
}
