import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Status } from '@prisma/client';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRoomDto {
  @ApiProperty({ example: 'Room 101' })
  @IsString()
  @IsNotEmpty()
  name: string;
  
  @ApiPropertyOptional({ example: 'active' })
  status?: Status;
}
