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
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { Course, Role, Status } from '@prisma/client';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CoursesService } from './courses.service';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CreateCourseDto } from './dto/create-course.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { QueryCourseDto } from './dto/query.dto';

@ApiBearerAuth()
@ApiTags('Courses')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @ApiOperation({ summary: `${Role.SUPERADMIN}, ${Role.ADMIN}` })
  @Get('all')
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  findAll(@Query() search: QueryCourseDto) {
    return this.coursesService.findAll(search);
  }

  @ApiOperation({ summary: `${Role.SUPERADMIN}, ${Role.ADMIN}` })
  @Get('all/freeze')
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  findAllFreeze() {
    return this.coursesService.findAllByStatus(Status.freeze);
  }

  @ApiOperation({ summary: `${Role.SUPERADMIN}, ${Role.ADMIN}` })
  @Get('one/:id')
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.coursesService.findOne(id);
  }

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(AnyFilesInterceptor())
  @ApiOperation({ summary: `${Role.SUPERADMIN}, ${Role.ADMIN}` })
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'JavaScript' },
        level: {
          type: 'string',
          enum: ['beginner', 'intermediate', 'advanced'],
          example: 'beginner',
        },
        description: { type: 'string', example: 'Learn JS' },
        price: { type: 'number', example: 100 },
        duration_month: { type: 'number', example: 3 },
        duration_hours: { type: 'number', example: 60 },
      },
      required: ['name', 'description', 'price'],
    },
  })
  create(@Body() dto: CreateCourseDto) {
    return this.coursesService.create(dto);
  }

  @ApiOperation({ summary: `${Role.SUPERADMIN}, ${Role.ADMIN}` })
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCourseDto) {
    return this.coursesService.update(id, dto);
  }

  @ApiOperation({ summary: `${Role.SUPERADMIN}, ${Role.ADMIN} ` })
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.coursesService.remove(id);
  }
}
