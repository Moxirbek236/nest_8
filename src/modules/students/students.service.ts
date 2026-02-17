import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RegisterDto } from 'src/auth/dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';



@Injectable()
export class StudentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateStudentDto) {
    const { email, password, address, first_name, last_name, phone, photo } = dto;

    const existing = await this.prisma.student.findFirst({
      where: { OR: [{ email }, { phone }] },
    });

    if (existing) {
      throw new BadRequestException('Student already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return this.prisma.student.create({
      data: {
        email,
        birth_date: dto.birth_date,
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

  async findByEmail(email: string) {
    return this.prisma.student.findUnique({ where: { email } });
  }

  async findById(id: number) {
    const student = await this.prisma.student.findUnique({
      where: { id },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }
    return student;
  }

  async findByPhone(phone: string) {
    return this.prisma.student.findUnique({ where: { phone } });
  }

  async findAllActive() {
    return this.prisma.student.findMany({
      where: { status: 'active' },
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

  async findAllInactive() {
    return this.prisma.student.findMany({
      where: { status: 'inactive' },
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

  async findAllFreeze() {
    return this.prisma.student.findMany({
      where: { status: 'freeze' },
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
    return this.prisma.student.findMany({
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
    const student = await this.prisma.student.findUnique({
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

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return student;
  }

  async update(id: number, dto: UpdateStudentDto) {
    const student = await this.prisma.student.findUnique({
      where: { id },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return this.prisma.student.update({
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
    const student = await this.prisma.student.findUnique({
      where: { id },
    });

    if (!student) {
      throw new NotFoundException('student not found');
    }

    await this.prisma.student.delete({
      where: { id },
    });

    return { message: 'student deleted successfully' };
  }
}
