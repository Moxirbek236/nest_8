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
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { AuthGuard } from 'src/common/guards/auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { RolesGuard } from 'src/common/guards/role.guard';
import { QueryDto } from './dto/query.dto';

@ApiBearerAuth()
@ApiTags('Attendance')
@UseGuards(AuthGuard, RolesGuard)
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @ApiOperation({
    summary: `${Role.ADMIN}, ${Role.TEACHER}, ${Role.SUPERADMIN}`,
  })
  @Roles(Role.ADMIN, Role.TEACHER, Role.SUPERADMIN)
  @Post()
  create(@Body() payload: CreateAttendanceDto, @Req() req: Request) {
    return this.attendanceService.create(payload, req['user']);
  }

  @ApiOperation({
    summary: `${Role.ADMIN}, ${Role.SUPERADMIN}`,
  })
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Get('all')
  findAll(@Query() query: QueryDto) {
    return this.attendanceService.findAll(query);
  }

  @ApiOperation({
    summary: `${Role.ADMIN}, ${Role.TEACHER}, ${Role.SUPERADMIN}`,
  })
  @Roles(Role.ADMIN, Role.TEACHER, Role.SUPERADMIN)
  @Get('me')
  findMyAttendance(@Req() req: Request) {
    return this.attendanceService.findMyAttendance(req['user']);
  }

  @ApiOperation({
    summary: `${Role.ADMIN}, ${Role.SUPERADMIN}`,
  })
  @Roles(Role.ADMIN, Role.TEACHER, Role.SUPERADMIN)
  @Get('one/:id')
  findOne(@Param('id') id: string) {
    return this.attendanceService.findOne(Number(id));
  }

  @ApiOperation({
    summary: `${Role.ADMIN}, ${Role.SUPERADMIN}`,
  })
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Put(':id')
  update(@Param('id') id: string, @Body() payload: UpdateAttendanceDto) {
    return this.attendanceService.update(Number(id), payload);
  }

  @Delete(':id')
  @ApiOperation({
    summary: `${Role.ADMIN}, ${Role.SUPERADMIN}`,
  })
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  remove(@Param('id') id: string) {
    return this.attendanceService.remove(Number(id));
  }
}
