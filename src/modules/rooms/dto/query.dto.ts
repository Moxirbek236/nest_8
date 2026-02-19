import { ApiPropertyOptional } from '@nestjs/swagger';
import { Status } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class QueryRoomDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Filter by room name' })
  name?: string;

  @IsOptional()
  @IsEnum(Status)
  @ApiPropertyOptional({ description: 'Filter by room status', enum: Status })
  status?: Status;
}
