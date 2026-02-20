import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateLessonDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsInt()
    @Min(1)
    @Type(() => Number)
    group_id?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    topic?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    description?: string;
}