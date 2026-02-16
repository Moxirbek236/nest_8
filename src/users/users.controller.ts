import {
  Controller,
  Get,
  Param,
  Delete,
  Body,
  ParseIntPipe,
  UseGuards,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { UpdateUserDto } from './dto/user.dto';
import { RolesGuard } from '.././common/guards/role.guard.js';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
@UseGuards(AuthGuard, RolesGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ApiBearerAuth()
  async getAll() {
    return this.usersService.findAll();
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.USER)
  @ApiBearerAuth()
  @Get(':id')
  async getOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findById(id);
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.USER)
  @ApiBearerAuth()
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
    return this.usersService.updateUser(id, dto);
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ApiBearerAuth()
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.deleteUser(id);
  }
}
