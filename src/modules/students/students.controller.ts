import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { RegisterDto } from 'src/auth/dto/auth.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { StudentService } from './students.service';
import { UpdateStudentDto } from './dto/update-student.dto';
import { CreateStudentDto } from './dto/create-student.dto';

@ApiTags('Students')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
@Roles(Role.ADMIN, Role.SUPERADMIN)
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentService) {}

  
  @ApiOperation({ summary: `${Role.SUPERADMIN}, ${Role.ADMIN}` })
  @Get('all')
  findAll() {
    return this.studentsService.findAll();
  }
  
  @ApiOperation({ summary: `${Role.SUPERADMIN}, ${Role.ADMIN}` })
  @Get('one/:id')
  findOne(@Param('id') id: string) {
    return this.studentsService.findOne(+id);
  }
  
  @ApiOperation({ summary: `${Role.SUPERADMIN}, ${Role.ADMIN}` })
  @Get('active')
  findActive() {
    return this.studentsService.findAllActive();
  }
  
  @ApiOperation({ summary: `${Role.SUPERADMIN}, ${Role.ADMIN}` })
  @Get('inactive')
  findInactive() {
    return this.studentsService.findAllInactive();
  }
  
  @ApiOperation({ summary: `${Role.SUPERADMIN}, ${Role.ADMIN}` })
  @Get('freeze')
  findFreeze() {
    return this.studentsService.findAllFreeze();
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
    FileInterceptor('avatar', {
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
  @ApiBearerAuth()
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.create(createStudentDto);
  }
  @ApiOperation({ summary: `${Role.SUPERADMIN}, ${Role.ADMIN}` })

  @Put(':id')
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentsService.update(+id, updateStudentDto);
  }

  @ApiOperation({ summary: `${Role.SUPERADMIN}, ${Role.ADMIN}` })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentsService.remove(+id);
  }
}
