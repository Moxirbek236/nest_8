import { Injectable, NotFoundException } from '@nestjs/common';
import { Role, Status } from '@prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateHomeworkDto } from './dto/create-homework.dto';
import { UpdateHomeworkDto } from './dto/update-homework.dto';

@Injectable()
export class HomeworkService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    payload: CreateHomeworkDto,
    currentUser: { id: number; role: Role },
    file?: Express.Multer.File,
  ) {
    const existGroup = await this.prisma.group.findUnique({
      where: { id: payload.group_id, status: Status.active },
    });

    if (!existGroup) {
      throw new NotFoundException('Group not found or inactive');
    }

    if (
      currentUser.role === Role.TEACHER &&
      existGroup.teacher_id !== currentUser.id
    ) {
      throw new NotFoundException('You are not the teacher of this group');
    }

    const existLesson = await this.prisma.lesson.findUnique({
      where: { id: payload.lesson_id },
    });

    if (!existLesson) {
      throw new NotFoundException('Lesson not found');
    }

    const fileData = file ? file.filename : null;

    await this.prisma.homework.create({
      data: {
        ...payload,
        file: fileData,
        teacher_id: currentUser.role === Role.TEACHER ? currentUser.id : null,
        user_id: currentUser.role != Role.TEACHER ? currentUser.id : null,
      },
    });
    return {
      status: 201,
      success: true,
      message: 'Homework created successfully',
    };
  }

  async findAll(query) {
    const where: any = {};

    if (query.group_id) {
      where.group_id = query.group_id;
    }

    if (query.lesson_id) {
      where.lesson_id = query.lesson_id;
    }

    return this.prisma.homework.findMany({
      where,
      include: {
        groups: true,
        lessons: true,
        teachers: true,
      },
    });
  }

  async findMyHomework(currentUser: { id: number; role: Role }) {
    const where: any = {};
    if (currentUser.role === Role.TEACHER) {
      where.teacher_id = currentUser.id;
    } else {
      where.user_id = currentUser.id;
    }
    return this.prisma.homework.findMany({
      where,
      include: {
        groups: true,
        lessons: true,
        teachers: true,
      },
    });
  }

  async findOne(id: number) {
    const homework = await this.prisma.homework.findUnique({
      where: { id },
      include: {
        groups: true,
        lessons: true,
        teachers: true,
        homeworkAnswerStudents: true,
        homeworkAnswerTeachers: true,
      },
    });
    if (!homework) {
      throw new NotFoundException('Homework not found');
    }
    return homework;
  }

  async update(id: number, payload: UpdateHomeworkDto, file?: Express.Multer.File) {
    await this.findOne(id);

    const { group_id, lesson_id, ...rest } = payload;

    if (group_id !== undefined) {
      const group = await this.prisma.group.findUnique({
        where: { id: group_id },
      });

      if (!group) {
        throw new NotFoundException('Group not found');
      }
    }

    if (lesson_id !== undefined) {
      const lesson = await this.prisma.lesson.findUnique({
        where: { id: lesson_id },
      });

      if (!lesson) {
        throw new NotFoundException('Lesson not found');
      }
    }

    const fileData = file ? file.filename : undefined;

    await this.prisma.homework.update({
      where: { id },
      data: {
        ...rest,
        ...(group_id !== undefined && {
          group_id,
        }),
        ...(lesson_id !== undefined && {
          lesson_id,
        }),
        ...(fileData && {
          file: fileData,
        }),
      },
    });

    return {
      status: 200,
      success: true,
      message: 'Homework updated successfully',
    };
  }

  async remove(id: number) {
    await this.prisma.homework.delete({
      where: { id },
    });
    return {
      status: 200,
      success: true,
      message: 'Homework removed successfully',
    };
  }
}
