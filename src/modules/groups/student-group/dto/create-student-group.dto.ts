import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber } from "class-validator";

export class CreateStudentGroupDto {
    @ApiProperty({ example: 1 })
    @Type(() => Number)
    @IsNumber()
    student_id: number;

    @ApiProperty({ example: 1 })
    @Type(() => Number)
    @IsNumber()
    group_id: number;
}
