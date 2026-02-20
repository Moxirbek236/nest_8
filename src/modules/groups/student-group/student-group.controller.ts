import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  Put,
} from '@nestjs/common';
import { StudentGroupService } from './student-group.service';
import { CreateStudentGroupDto } from './dto/create-student-group.dto';
import { UpdateStudentGroupDto } from './dto/update-student-group.dto';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';

@ApiTags('Student Groups')
@Controller('student-group')
export class StudentGroupController {
  constructor(private readonly studentGroupService: StudentGroupService) {}

  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateStudentGroupDto })
  @UseInterceptors(FilesInterceptor('files'))
  @Post()
  create(@Body() createStudentGroupDto: CreateStudentGroupDto) {
    console.log(createStudentGroupDto);
    
    return this.studentGroupService.create(createStudentGroupDto);
  }

  @Get()
  findAll() {
    return this.studentGroupService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentGroupService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateStudentGroupDto: UpdateStudentGroupDto,
  ) {
    return this.studentGroupService.update(+id, updateStudentGroupDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentGroupService.remove(+id);
  }
}
