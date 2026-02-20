import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { GroupStatus } from '@prisma/client';
import { FindGroupsQueryDto } from './dto/query.dto';

function addHours(time: string, hours: number): string {
  const [h, m] = time.split(':').map(Number);
  let endH = h + hours;
  let endM = m;

  if (endH >= 24) endH = endH % 24;

  return `${endH.toString().padStart(2, '0')}:${endM
    .toString()
    .padStart(2, '0')}`;
}

@Injectable()
export class GroupsService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createGroupDto: CreateGroupDto) {
    const {
      teacher_id,
      room_id,
      course_id,
      start_date,
      start_time,
      week_day,
      max_student,
    } = createGroupDto;

    if (max_student <= 0) {
      throw new BadRequestException('max_student must be greater than 0');
    }

    const [teacher, room, course] = await Promise.all([
      this.prismaService.teacher.findUnique({ where: { id: teacher_id } }),
      this.prismaService.room.findUnique({ where: { id: room_id } }),
      this.prismaService.course.findUnique({ where: { id: course_id } }),
    ]);

    if (!teacher) throw new BadRequestException('Teacher not found');
    if (!room) throw new BadRequestException('Room not found');
    if (!course) throw new BadRequestException('Course not found');

    const lessonEndTime = addHours(start_time, course.duration_hours);

    for (const day of week_day) {
      const roomConflict = await this.prismaService.group.findFirst({
        where: {
          room_id,
          start_date: new Date(start_date),
          week_day: { array_contains: day },
          AND: [
            { start_time: { lt: lessonEndTime } },
            { start_time: { gte: start_time } },
          ],
        },
      });

      if (roomConflict) {
        throw new BadRequestException(
          `Room is busy on ${day} at ${start_time}`,
        );
      }
    }

    for (const day of week_day) {
      const teacherConflict = await this.prismaService.group.findFirst({
        where: {
          teacher_id,
          start_date: new Date(start_date),
          week_day: { array_contains: day },
          AND: [
            { start_time: { lt: lessonEndTime } },
            { start_time: { gte: start_time } },
          ],
        },
      });

      if (teacherConflict) {
        throw new BadRequestException(
          `Teacher is busy on ${day} at ${start_time}`,
        );
      }
    }

    await this.prismaService.group.create({
      data: {
        ...createGroupDto,
        start_date: new Date(createGroupDto.start_date),
        course_id: createGroupDto.course_id,
        teacher_id: createGroupDto.teacher_id,
        room_id: createGroupDto.room_id,
      },
    });

    return {
      status: 200,
      success: true,
      message: 'Group created successfully',
    };
  }

  async findAll(query: FindGroupsQueryDto) {
    const {
      status,
      teacher_id,
      room_id,
      course_id,
      start_date,
      week_day,
      name,
    } = query;

    const where: any = {};

    if (status) where.status = status;
    if (teacher_id) where.teacher_id = teacher_id;
    if (room_id) where.room_id = room_id;
    if (course_id) where.course_id = course_id;
    if (start_date) where.start_date = new Date(start_date);
    if (week_day) where.week_day = { array_contains: week_day };
    if (name) where.name = { contains: name, mode: 'insensitive' };

    return this.prismaService.group.findMany({
      where,
      include: {
        teachers: true,
        rooms: true,
        courses: true,
        studentGroups: {
          include: { students: true },
        },
      },
      orderBy: { start_date: 'asc' },
    });
  }

  async findOne(id: number) {
    const group = await this.prismaService.group.findUnique({
      where: { id },
      include: {
        teachers: true,
        rooms: true,
        courses: true,
        studentGroups: { include: { students: true } },
      },
    });
    if (!group) throw new BadRequestException('Group not found');
    return group;
  }

  async update(id: number, updateGroupDto: UpdateGroupDto) {
    const group = await this.prismaService.group.findUnique({ where: { id } });
    if (!group) throw new BadRequestException('Group not found');

    if (updateGroupDto.teacher_id) {
      const teacher = await this.prismaService.teacher.findUnique({
        where: { id: updateGroupDto.teacher_id },
      });
      if (!teacher) throw new BadRequestException('Teacher not found');
    }
    if (updateGroupDto.room_id) {
      const room = await this.prismaService.room.findUnique({
        where: { id: updateGroupDto.room_id },
      });
      if (!room) throw new BadRequestException('Room not found');
    }
    if (updateGroupDto.course_id) {
      const course = await this.prismaService.course.findUnique({
        where: { id: updateGroupDto.course_id },
      });
      if (!course) throw new BadRequestException('Course not found');
    }

    await this.prismaService.group.update({
      where: { id },
      data: {
        ...updateGroupDto,
        ...(updateGroupDto.start_date && {
          start_date: new Date(updateGroupDto.start_date),
        }),
      },
    });

    return {
      status: 200,
      success: true,
      message: 'Group updated successfully',
    };
  }

  async remove(id: number) {
    const group = await this.prismaService.group.findUnique({ where: { id } });
    if (!group) throw new BadRequestException('Group not found');

    await this.prismaService.group.delete({ where: { id } });
    return {
      status: 200,
      success: true,
      message: 'Group removed successfully',
    };
  }
}
