import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional } from "class-validator";

export class QueryDto {
    @ApiPropertyOptional({ required: false })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    group_id?: number;

    @ApiPropertyOptional({ required: false })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    teacher_id?: number;
}