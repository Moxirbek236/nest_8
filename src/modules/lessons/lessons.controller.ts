import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create.lesson.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { AuthGuard } from 'src/common/guards/auth.guard';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { RolesGuard } from 'src/common/guards/role.guard';
import { QueryDto } from './dto/query.dto';

@ApiBearerAuth()
@ApiTags('Lessons')
@UseGuards(AuthGuard, RolesGuard)
@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @ApiOperation({
    summary: `${Role.ADMIN}, ${Role.TEACHER}, ${Role.SUPERADMIN}`,
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files'))
  @Roles(Role.ADMIN, Role.TEACHER, Role.SUPERADMIN)
  @Post()
  create(@Body() payload: CreateLessonDto, @Req() req: Request) {
    return this.lessonsService.create(payload, req['user']);
  }

  @ApiOperation({
    summary: `${Role.ADMIN}, ${Role.TEACHER}, ${Role.SUPERADMIN}`,
  })
  @Roles(Role.ADMIN, Role.TEACHER, Role.SUPERADMIN)
  @Get('all')
  findAll(@Query() query: QueryDto) {
    return this.lessonsService.findAll(query);
  }

  @ApiOperation({
    summary: `${Role.ADMIN}, ${Role.TEACHER}, ${Role.SUPERADMIN}`,
  })
  @Roles(Role.ADMIN, Role.TEACHER, Role.SUPERADMIN)
  @Get('me')
  findMyLessons(@Req() req: Request) {
    return this.lessonsService.findMyLessons(req['user']);
  }

  @ApiOperation({
    summary: `${Role.ADMIN}, ${Role.SUPERADMIN}`,
  })
  @Roles(Role.ADMIN, Role.TEACHER, Role.SUPERADMIN)
  @Get('one/:id')
  findOne(@Req() req: Request, @Param('id') id: string) {
    return this.lessonsService.findOne(Number(id));
  }

  @ApiOperation({
    summary: `${Role.ADMIN}, ${Role.SUPERADMIN}`,
  })
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Put(':id')
  update(@Param('id') id: string, @Body() payload: CreateLessonDto) {
    return this.lessonsService.update(Number(id), payload);
  }

  @Delete(':id')
  @ApiOperation({
    summary: `${Role.ADMIN}, ${Role.SUPERADMIN}`,
  })
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  remove(@Param('id') id: string) {
    return this.lessonsService.remove(Number(id));
  }
}
