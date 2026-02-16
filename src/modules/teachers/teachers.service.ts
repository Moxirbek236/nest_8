import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateTeacherDto } from './dto/teacher.dto';
import { RegisterDto } from 'src/auth/dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class TeachersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: RegisterDto) {
    const { email, password, address, first_name, last_name, phone } = dto;

    const existing = await this.prisma.teacher.findFirst({
      where: { OR: [{ email }, { phone }] },
    });

    if (existing) {
      throw new BadRequestException('Teacher already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return this.prisma.teacher.create({
      data: {
        email,
        last_name,
        first_name,
        phone,
        address,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        phone: true,
        address: true,
      },
    });
  }

  async findAll() {
    return this.prisma.teacher.findMany({
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        phone: true,
        address: true,
      },
    });
  }

  async findOne(id: number) {
    const teacher = await this.prisma.teacher.findUnique({
      where: { id },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        phone: true,
        address: true,
      },
    });

    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    return teacher;
  }

  async update(id: number, dto: UpdateTeacherDto) {
    const teacher = await this.prisma.teacher.findUnique({
      where: { id },
    });

    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    return this.prisma.teacher.update({
      where: { id },
      data: dto,
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        phone: true,
        address: true,
      },
    });
  }

  async remove(id: number) {
    const teacher = await this.prisma.teacher.findUnique({
      where: { id },
    });

    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    await this.prisma.teacher.delete({
      where: { id },
    });

    return { message: 'Teacher deleted successfully' };
  }
}
