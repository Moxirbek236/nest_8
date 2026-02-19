import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";
import { CourseLevel, Status } from "@prisma/client";

export class QueryCourseDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: "Course name for search" })
  name?: string;

  @IsOptional()
  @IsEnum(CourseLevel)
  @ApiPropertyOptional({ enum: CourseLevel, description: "Filter by course level" })
  level?: CourseLevel;

  @IsOptional()
  @IsEnum(Status)
  @ApiPropertyOptional({ enum: Status, description: "Filter by course status" })
  status?: Status;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @ApiPropertyOptional({ description: "Minimum price" })
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @ApiPropertyOptional({ description: "Maximum price" })
  maxPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @ApiPropertyOptional({ description: "Minimum duration in months" })
  minDurationMonth?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @ApiPropertyOptional({ description: "Maximum duration in months" })
  maxDurationMonth?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @ApiPropertyOptional({ description: "Minimum duration in hours" })
  minDurationHours?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @ApiPropertyOptional({ description: "Maximum duration in hours" })
  maxDurationHours?: number;
}
