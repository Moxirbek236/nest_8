import { Injectable, NotFoundException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    payload: CreateAttendanceDto,
    currentUser: { id: number; role: Role },
  ) {
    const existLesson = await this.prisma.lesson.findUnique({
      where: { id: payload.lesson_id },
    });

    if (!existLesson) {
      throw new NotFoundException('Lesson not found');
    }

    const existStudent = await this.prisma.student.findUnique({
      where: { id: payload.student_id },
    });

    if (!existStudent) {
      throw new NotFoundException('Student not found');
    }

    await this.prisma.attendance.create({
      data: {
        ...payload,
        teacher_id: currentUser.role === Role.TEACHER ? currentUser.id : null,
        user_id: currentUser.role != Role.TEACHER ? currentUser.id : null,
      },
    });
    return {
      status: 201,
      success: true,
      message: 'Attendance created successfully',
    };
  }

  async findAll(query) {
    const where: any = {};

    if (query.lesson_id) {
      where.lesson_id = query.lesson_id;
    }

    if (query.student_id) {
      where.student_id = query.student_id;
    }

    return this.prisma.attendance.findMany({
      where,
      include: {
        lessons: true,
        students: true,
        teachers: true,
      },
    });
  }

  async findMyAttendance(currentUser: { id: number; role: Role }) {
    const where: any = {};
    if (currentUser.role === Role.TEACHER) {
      where.teacher_id = currentUser.id;
    } else {
      where.user_id = currentUser.id;
    }
    return this.prisma.attendance.findMany({
      where,
      include: {
        lessons: true,
        students: true,
        teachers: true,
      },
    });
  }

  async findOne(id: number) {
    const attendance = await this.prisma.attendance.findUnique({
      where: { id },
      include: {
        lessons: true,
        students: true,
        teachers: true,
      },
    });
    if (!attendance) {
      throw new NotFoundException('Attendance not found');
    }
    return attendance;
  }

  async update(id: number, payload: UpdateAttendanceDto) {
    await this.findOne(id);

    const { lesson_id, student_id, ...rest } = payload;

    if (lesson_id !== undefined) {
      const lesson = await this.prisma.lesson.findUnique({
        where: { id: lesson_id },
      });

      if (!lesson) {
        throw new NotFoundException('Lesson not found');
      }
    }

    if (student_id !== undefined) {
      const student = await this.prisma.student.findUnique({
        where: { id: student_id },
      });

      if (!student) {
        throw new NotFoundException('Student not found');
      }
    }

    await this.prisma.attendance.update({
      where: { id },
      data: {
        ...rest,
        ...(lesson_id !== undefined && {
          lesson_id,
        }),
        ...(student_id !== undefined && {
          student_id,
        }),
      },
    });

    return {
      status: 200,
      success: true,
      message: 'Attendance updated successfully',
    };
  }

  async remove(id: number) {
    await this.prisma.attendance.delete({
      where: { id },
    });
    return {
      status: 200,
      success: true,
      message: 'Attendance removed successfully',
    };
  }
}
