import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateTeacherDto } from './dto/teacher.dto';
import { QueryAuthDto, RegisterDto } from 'src/auth/dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { EmailService } from 'src/common/email/email.service';

@Injectable()
export class TeachersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  async uploadAvatar(file: any): Promise<string> {
    const filePath = `uploads/${file.filename}`;
    return filePath;
  }

  async findMe(id: number) {
    const existTeacher = await this.prisma.teacher.findUnique({
      where: { id },
    });

    if (!existTeacher) {
      throw new NotFoundException('Teacher not found');
    }
    const teacher = await this.prisma.teacher.findUnique({
      where: { id },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        phone: true,
        address: true,
        status: true,
        photo: true,
        groups: {
          select: {
            id: true,
            courses: true,
            rooms: true,
            start_date: true,
            start_time: true,
            week_day: true,
          },
        },
      },
    });
    return teacher;
  }

  async create(dto: RegisterDto, photo: Express.Multer.File) {
    const { email, password, address, first_name, last_name, phone } = dto;

    const existing = await this.prisma.teacher.findFirst({
      where: { OR: [{ email }, { phone }] },
    });

    if (existing) {
      throw new BadRequestException('Teacher already exists');
    }

    if (!photo) {
      throw new BadRequestException('Teacher photo is required');
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const avatarUrl = photo ? await this.uploadAvatar(photo) : null;

    this.emailService.sendVerificationEmail(dto.email, dto.email, dto.password);

    return this.prisma.teacher.create({
      data: {
        email,
        last_name,
        first_name,
        phone,
        address,
        photo: avatarUrl,
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
    return this.prisma.teacher.findUnique({ where: { email } });
  }

  async findById(id: number) {
    const teacher = await this.prisma.teacher.findUnique({
      where: { id },
    });

    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }
    return teacher;
  }

  async findByPhone(phone: string) {
    return this.prisma.teacher.findUnique({ where: { phone } });
  }

  async findAllInactive() {
    return this.prisma.teacher.findMany({
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
    return this.prisma.teacher.findMany({
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

  async findAll(filter: QueryAuthDto) {
    const where: any = {};

    if (filter.first_name) {
      where.first_name = { contains: filter.first_name, mode: 'insensitive' };
    }

    if (filter.last_name) {
      where.last_name = { contains: filter.last_name, mode: 'insensitive' };
    }

    if (filter.email) {
      where.email = filter.email;
    }

    if (filter.status) {
      where.status = filter.status;
    }

    return this.prisma.teacher.findMany({
      where,
      orderBy: { id: 'asc' },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        phone: true,
        address: true,
        status: true,
        photo: true,
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

    await this.prisma.teacher.update({
      where: { id },
      data: { status: 'inactive' },
    });

    return { message: 'Teacher deleted successfully' };
  }
}
