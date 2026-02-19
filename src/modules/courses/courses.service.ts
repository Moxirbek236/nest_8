import { Injectable, NotFoundException } from '@nestjs/common';
import { Status } from '@prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CreateCourseDto } from './dto/create-course.dto';
import { QueryCourseDto } from './dto/query.dto';
@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  findAll(search: QueryCourseDto) {
    const where: any = {
      status: 'active',
    };

    if (search.name) {
      where.name = { contains: search.name, mode: 'insensitive' };
    }

    if (search.level) {
      where.level = search.level;
    }

    if (search.minPrice || search.maxPrice) {
      where.price = {};
      if (search.minPrice !== undefined) where.price.gte = search.minPrice;
      if (search.maxPrice !== undefined) where.price.lte = search.maxPrice;
    }

    if (search.minDurationMonth || search.maxDurationMonth) {
      where.duration_month = {};
      if (search.minDurationMonth !== undefined)
        where.duration_month.gte = search.minDurationMonth;
      if (search.maxDurationMonth !== undefined)
        where.duration_month.lte = search.maxDurationMonth;
    }

    if (search.minDurationHours || search.maxDurationHours) {
      where.duration_hours = {};
      if (search.minDurationHours !== undefined)
        where.duration_hours.gte = search.minDurationHours;
      if (search.maxDurationHours !== undefined)
        where.duration_hours.lte = search.maxDurationHours;
    }

    return this.prisma.course.findMany({
      where,
      orderBy: { created_at: 'desc' },
    });
  }

  findAllByStatus(status: Status) {
    return this.prisma.course.findMany({
      where: { status },
    });
  }

  async findOne(id: number) {
    const course = await this.prisma.course.findUnique({
      where: { id },
    });

    if (!course) throw new NotFoundException('Course not found');
    return course;
  }

  async findOneByStatus(id: number, status: Status) {
    const course = await this.prisma.course.findFirst({
      where: { id, status },
    });

    if (!course) throw new NotFoundException('Course not found');
    return course;
  }

  async create(dto: CreateCourseDto) {
    return await this.prisma.course.create({
      data: dto,
    });
  }

  async update(id: number, dto: UpdateCourseDto) {
    return await this.prisma.course.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    await this.prisma.course.update({
      where: { id },
      data: { status: 'inactive' },
    });
  }
}
