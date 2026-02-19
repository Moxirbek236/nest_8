import { ApiProperty } from "@nestjs/swagger";
import {  StudentStatus } from "@prisma/client";
import { IsDateString, IsEmail, IsMobilePhone, IsString, IsStrongPassword } from "class-validator";

export class CreateStudentDto {
    @IsString()
    @ApiProperty({ example: 'John' })
    first_name: string;

    @IsString()
    @ApiProperty({ example: 'Doe' })
    last_name: string;

    @IsStrongPassword()
    @ApiProperty({ example: 'password123' })
    password: string
    
    @IsMobilePhone("uz-UZ")
    @ApiProperty({ example: '+1234567890' })
    phone: string;

    @IsEmail()
    @ApiProperty({ example: 'john.doe@example.com' })
    email: string

    @ApiProperty({ example: '2000-01-01' })
    @IsDateString()
    birth_date: Date;

    @IsString()
    @ApiProperty({ example: '123 Main St' })
    address: string;

    @ApiProperty({ type: 'string', format: 'binary' })
    photo: string;

    @ApiProperty({ example: 'active' })
    status: StudentStatus;
}