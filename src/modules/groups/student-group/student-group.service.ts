import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateStudentGroupDto } from './dto/create-student-group.dto';
import { UpdateStudentGroupDto } from './dto/update-student-group.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { Status } from '@prisma/client';

@Injectable()
export class StudentGroupService {
  constructor(private readonly prisma : PrismaService) {}
  async create(createStudentGroupDto: CreateStudentGroupDto) {
    
    const existStudentGroup = await this.prisma.group.findFirst({
      where: {
        id: createStudentGroupDto.group_id,
        status: Status.active,
      },
    });

    if (!existStudentGroup) {
      throw new BadRequestException('Group not found or inactive');
    }

    const existGroupStudentCount = await this.prisma.studentGroup.count({
      where: {
        group_id: createStudentGroupDto.group_id,
        status: Status.active,
      },
    });

    if (existGroupStudentCount >= existStudentGroup.max_student) {
      throw new BadRequestException('Group is full');
    }

    const existGroupStudent = await this.prisma.studentGroup.findFirst({
      where: {
        group_id: createStudentGroupDto.group_id,
        student_id: createStudentGroupDto.student_id,
        status: Status.active,
      },
    });

    if (existGroupStudent) {
      throw new BadRequestException('Student already in group');
    }

    // await this.prisma.studentGroup.create({
    //   data: createStudentGroupDto,
    // });

    return {status: 200, success: true, message: "Student group created successfully"};
  }

  findAll() {
    return this.prisma.studentGroup.findMany({
      where: { status: Status.active },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} studentGroup`;
  }

  update(id: number, updateStudentGroupDto: UpdateStudentGroupDto) {
    return `This action updates a #${id} studentGroup`;
  }

  remove(id: number) {
    return `This action removes a #${id} studentGroup`;
  }
}
