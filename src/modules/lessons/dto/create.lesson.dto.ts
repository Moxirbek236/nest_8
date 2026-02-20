import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {  IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateLessonDto {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  group_id: number;

  @ApiProperty()
  @IsString()
  topic: string;
  
  @ApiProperty()
  @IsOptional()
  @IsString()
  description?: string;
}
