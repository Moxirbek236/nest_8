import {
  Controller,
  Get,
  Param,
  Patch,
  Delete,
  Body,
  ParseIntPipe,
  UseGuards,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { UpdateUserDto } from './dto/user.dto';
@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async getAll() {
    return this.usersService.findAll();
  }
  @Get(':id')
  async getOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findById(id);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
    return this.usersService.updateUser(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.deleteUser(id);
  }
}
