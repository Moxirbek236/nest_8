import {
  Controller,
  Get,
  Param,
  Delete,
  Body,
  ParseIntPipe,
  UseGuards,
  Put,
  Post,
  UseInterceptors,
  UploadedFile,
  Req,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { UpdateUserDto } from './dto/user.dto';
import { RolesGuard } from '../../common/guards/role.guard.js';
import { Roles } from 'src/common/decorators/roles.decorator';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { QueryAuthDto, RegisterDto } from 'src/auth/dto/auth.dto';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { QueryCourseDto } from '../courses/dto/query.dto';

@ApiTags('Admins')
@Controller('users')
@UseGuards(AuthGuard, RolesGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: `${Role.SUPERADMIN}, ${Role.ADMIN}` })
  @Get('all')
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  findAll(@Query() search: QueryAuthDto) {
    return this.usersService.findAll(search);
  }
  @ApiOperation({ summary: `${Role.SUPERADMIN}` })
  @Get('all/inactive')
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ApiBearerAuth()
  async getInActiveUsers() {
    return this.usersService.findAllInActiveAdmins();
  }


  @ApiOperation({ summary: `${Role.SUPERADMIN}` })
  @Get('all/freeze')
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ApiBearerAuth()
  async getFreezeUsers() {
    return this.usersService.findAllFreezeAdmins();
  }

  @ApiOperation({ summary: `${Role.SUPERADMIN}` })
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.TEACHER)
  @ApiBearerAuth()
  @Get('one/:id')
  async getOneUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findByIdAdmin(id);
  }

  @ApiOperation({ summary: `${Role.SUPERADMIN}` })
  @UseGuards(AuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'List of create users DTO',
    type: RegisterDto,
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' },
        password: { type: 'string', example: 'password123' },
        first_name: { type: 'string', example: 'John' },
        last_name: { type: 'string', example: 'Doe' },
        phone: { type: 'string', example: '+1234567890' },
        address: { type: 'string', example: '123 Main St' },
        avatar: {
          type: 'string',
          format: 'binary',
          description: 'User avatar image',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 1e9).toString(36))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  @Post()
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @UseInterceptors(AnyFilesInterceptor())

  @ApiBearerAuth()
  async createUser(
    // @Body() dto: RegisterDto,
    @Req() req: any,
    @Body() body: any,
    @UploadedFile() photo: Express.Multer.File,
  ) {
    const dto = new RegisterDto();
    Object.assign(dto, body);
    return this.usersService.createAdmin(dto, photo);
  }

  @ApiOperation({ summary: `${Role.SUPERADMIN}` })
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.TEACHER)
  @ApiBearerAuth()
  @Put(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.updateAdmin(id, dto);
  }

  @ApiOperation({ summary: `${Role.SUPERADMIN}` })
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ApiBearerAuth()
  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.deleteAdmin(id);
  }
}
