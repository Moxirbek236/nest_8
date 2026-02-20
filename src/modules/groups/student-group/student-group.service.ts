import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateStudentGroupDto } from './dto/create-student-group.dto';
import { UpdateStudentGroupDto } from './dto/update-student-group.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { Status } from '@prisma/client';

@Injectable()
export class StudentGroupService {
  constructor(private readonly prisma: PrismaService) {}
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

    await this.prisma.studentGroup.create({
      data: createStudentGroupDto,
    });

    return {
      status: 200,
      success: true,
      message: 'Student group created successfully',
    };
  }

  async findAll() {
    const data = await this.prisma.studentGroup.findMany({
      where: { status: Status.active },
    });

    return {
      status: 200,
      success: true,
      data
    };
  }

  async findOne(id: number) {
    const data = await this.prisma.studentGroup.findUnique({
      where: { id, status: Status.active },
    });
    return {
      status: 200,
      success: true,
      data,
    };
  }

  async update(id: number, updateStudentGroupDto: UpdateStudentGroupDto) {
    await this.prisma.studentGroup
      .update({
        where: { id, status: Status.active },
        data: updateStudentGroupDto,
      })
      .catch(() => {
        throw new BadRequestException('Student group not found or inactive');
      });

    return {
      status: 200,
      success: true,
      message: 'Student group updated successfully',
    };
  }

  async remove(id: number) {
    // await this.prisma.studentGroup
    //   .delete({
    //     where: { id },
    //   })
    //   .catch(() => {
    //     throw new BadRequestException('Student group not found');
    //   });

    //   return {
    //     status: 200,
    //     success: true,
    //     message: 'Student group removed successfully',
    //   };
    await this.prisma.studentGroup.update({
      where: { id, status: Status.active },
      data: { status: Status.inactive },
    });

    return {
      status: 200,
      success: true,
      message: 'Student group removed successfully',
    };
  }
}
