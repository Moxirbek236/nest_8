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
  UploadedFile,
} from '@nestjs/common';
import { HomeworkService } from './homework.service';
import { CreateHomeworkDto } from './dto/create-homework.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { AuthGuard } from 'src/common/guards/auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { RolesGuard } from 'src/common/guards/role.guard';
import { QueryDto } from './dto/query.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';

@ApiBearerAuth()
@ApiTags('Homework')
@UseGuards(AuthGuard, RolesGuard)
@Controller('homework')
export class HomeworkController {
  constructor(private readonly homeworkService: HomeworkService) {}

  @ApiOperation({
    summary: `${Role.ADMIN}, ${Role.TEACHER}, ${Role.SUPERADMIN}`,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: CreateHomeworkDto,
  })
  @UseInterceptors(
    FileInterceptor('file', {
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
  @Roles(Role.ADMIN, Role.TEACHER, Role.SUPERADMIN)
  @Post()
  create(
    @Body() payload: CreateHomeworkDto,
    @Req() req: Request,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.homeworkService.create(payload, req['user'], file);
  }

  @ApiOperation({
    summary: `${Role.ADMIN}, ${Role.TEACHER}, ${Role.SUPERADMIN}`,
  })
  @Roles(Role.ADMIN, Role.TEACHER, Role.SUPERADMIN)
  @Get('all')
  findAll(@Query() query: QueryDto) {
    return this.homeworkService.findAll(query);
  }

  @ApiOperation({
    summary: `${Role.ADMIN}, ${Role.TEACHER}, ${Role.SUPERADMIN}`,
  })
  @Roles(Role.ADMIN, Role.TEACHER, Role.SUPERADMIN)
  @Get('me')
  findMyHomework(@Req() req: Request) {
    return this.homeworkService.findMyHomework(req['user']);
  }

  @ApiOperation({
    summary: `${Role.ADMIN}, ${Role.SUPERADMIN}`,
  })
  @Roles(Role.ADMIN, Role.TEACHER, Role.SUPERADMIN)
  @Get('one/:id')
  findOne(@Req() req: Request, @Param('id') id: string) {
    return this.homeworkService.findOne(Number(id));
  }

  @ApiOperation({
    summary: `${Role.ADMIN}, ${Role.SUPERADMIN}`,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: CreateHomeworkDto,
  })
  @UseInterceptors(
    FileInterceptor('file', {
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
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() payload: CreateHomeworkDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.homeworkService.update(Number(id), payload, file);
  }

  @Delete(':id')
  @ApiOperation({
    summary: `${Role.ADMIN}, ${Role.SUPERADMIN}`,
  })
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  remove(@Param('id') id: string) {
    return this.homeworkService.remove(Number(id));
  }
}
