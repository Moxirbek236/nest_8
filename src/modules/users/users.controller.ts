import {
  Controller,
  Get,
  Param,
  Delete,
  Body,
  ParseIntPipe,
  UseGuards,
  Put,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { UpdateUserDto } from './dto/user.dto';
import { RolesGuard } from '../../common/guards/role.guard.js';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';

@ApiTags('Admins')
@Controller('users')
@UseGuards(AuthGuard, RolesGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ApiBearerAuth()
  async getAllUsers() {
    return this.usersService.findAllAdmins();
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.TEACHER)
  @ApiBearerAuth()
  @Get(':id')
  async getOneUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findByIdAdmin(id);
  }
  
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.TEACHER)
  @ApiBearerAuth()
  @Put(':id')
  updateUser(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
    return this.usersService.updateAdmin(id, dto);
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ApiBearerAuth()
  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.deleteAdmin(id);
  }
}
