import { Injectable, NotFoundException } from '@nestjs/common';
import { Role, Status } from '@prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateLessonDto } from './dto/create.lesson.dto';
import { UpdateLessonDto } from './dto/update.dto';

@Injectable()
export class LessonsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    payload: CreateLessonDto,
    currentUser: { id: number; role: Role },
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

    await this.prisma.lesson.create({
      data: {
        ...payload,
        teacher_id: currentUser.role === Role.TEACHER ? currentUser.id : null,
        user_id: currentUser.role != Role.TEACHER ? currentUser.id : null,
      },
    });
    return {
      status: 201,
      success: true,
      message: 'Lesson created successfully',
    };
  }

  async findAll(query) {
    const where: any = {};

    if (query.group_id) {
      where.group_id = query.group_id;
    }

    return this.prisma.lesson.findMany({
      where,
    });
  }

  async findMyLessons(currentUser: { id: number; role: Role }) {
    const where: any = {};
    if (currentUser.role === Role.TEACHER) {
      where.teacher_id = currentUser.id;
    } else {
      where.user_id = currentUser.id;
    }
    return this.prisma.lesson.findMany({
      where,
    });
  }

  async findOne(id: number) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
    });
    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }
    return lesson;
  }

  async update(id: number, payload: UpdateLessonDto) {
    await this.findOne(id);

    const { group_id, ...rest } = payload;

    if (group_id !== undefined) {
      const group = await this.prisma.group.findUnique({
        where: { id: group_id },
      });

      if (!group) {
        throw new NotFoundException('Group not found');
      }
    }

    await this.prisma.lesson.update({
      where: { id },
      data: {
        ...rest,
        ...(group_id !== undefined && {
          group: {
            connect: { id: group_id },
          },
        }),
      },
    });

    return {
      status: 200,
      success: true,
      message: 'Lesson updated successfully',
    };
  }
  async remove(id: number) {
    await this.prisma.lesson.delete({
      where: { id },
    });
    return {
      status: 200,
      success: true,
      message: 'Lesson removed successfully',
    };
  }
}
