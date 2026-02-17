import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Post,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Role, Status } from '@prisma/client';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';

@ApiBearerAuth()
@ApiTags('Rooms')
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @ApiOperation({ summary: `${Role.SUPERADMIN}` })
  @Get('all')
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  findAll() {
    return this.roomsService.findAll();
  }

  @ApiOperation({ summary: `${Role.SUPERADMIN}` })
  @Get('all/active')
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  findAllActive() {
    return this.roomsService.findAllByStatus(Status.active);
  }

  @ApiOperation({ summary: `${Role.SUPERADMIN}` })
  @Get('all/inactive')
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  findAllInactive() {
    return this.roomsService.findAllByStatus(Status.inactive);
  }

  @ApiOperation({ summary: `${Role.SUPERADMIN}` })
  @Get('all/freeze')
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  findAllFreeze() {
    return this.roomsService.findAllByStatus(Status.freeze);
  }

  @ApiOperation({ summary: `${Role.SUPERADMIN}` })
  @Get('one/:id')
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.roomsService.findOne(id);
  }

  @ApiOperation({ summary: `${Role.SUPERADMIN}` })
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Post()
  create(@Body() dto: CreateRoomDto) {
    return this.roomsService.create(dto);
  }

  @ApiOperation({ summary: `${Role.SUPERADMIN}` })
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateRoomDto) {
    return this.roomsService.update(id, dto);
  }

  @ApiOperation({ summary: `${Role.SUPERADMIN}` })
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.roomsService.remove(id);
  }
}
