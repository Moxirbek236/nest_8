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
  UploadedFile,
  Req,
  Query,
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
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { StudentService } from './students.service';
import { UpdateStudentDto } from './dto/update-student.dto';
import { CreateStudentDto } from './dto/create-student.dto';
import { QueryStudentDto } from './dto/query.dto';

@ApiTags('Students')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
@Roles(Role.ADMIN, Role.SUPERADMIN)
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentService) {}

  @ApiOperation({ summary: `${Role.SUPERADMIN}, ${Role.ADMIN}` })
  @Get('all')
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  findAll(@Query() search: QueryStudentDto) {
    return this.studentsService.findAll(search);
  }

  @ApiOperation({ summary: `${Role.SUPERADMIN}, ${Role.ADMIN}` })
  @Get('one/:id')
  findOne(@Param('id') id: string) {
    return this.studentsService.findOne(+id);
  }

  @ApiOperation({ summary: `${Role.SUPERADMIN}, ${Role.ADMIN}` })
  @Get('archive')
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
    schema: {
      type: 'object',
      properties: {
        first_name: { type: 'string', example: 'John' },
        last_name: { type: 'string', example: 'Doe' },
        email: { type: 'string', example: 'user@example.com' },
        phone: { type: 'string', example: '+1234567890' },
        address: { type: 'string', example: '123 Main St' },
        birth_date: { type: 'string', format: 'date', example: '2000-12-31' },
        password: { type: 'string', example: 'password123' },
        photo: { type: 'string', format: 'binary', description: 'User avatar' },
      },
      required: ['first_name', 'last_name', 'email', 'password', 'birth_date'],
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
  @ApiBearerAuth()
  create(
    @Body() createStudentDto: CreateStudentDto,
    @UploadedFile() photo: Express.Multer.File,
    @Req() req: any,
  ) {
    return this.studentsService.create(createStudentDto, photo);
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
