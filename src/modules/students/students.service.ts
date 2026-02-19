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
import { EmailService } from 'src/common/email/email.service';
import { QueryCourseDto } from '../courses/dto/query.dto';
import { QueryStudentDto } from './dto/query.dto';

@Injectable()
export class StudentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  async uploadAvatar(file: any): Promise<string> {
    const filePath = `uploads/${file.filename}`;
    return filePath;
  }

  async create(dto: CreateStudentDto, photo: Express.Multer.File) {
    const { email, password, address, first_name, last_name, phone } = dto;

    const existing = await this.prisma.student.findFirst({
      where: { OR: [{ email }, { phone }] },
    });

    if (existing) {
      throw new BadRequestException('Student already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const avatarUrl = photo ? await this.uploadAvatar(photo) : null;

    this.emailService.sendVerificationEmail(dto.email, dto.email, dto.password);

    return this.prisma.student.create({
      data: {
        email,
        birth_date: new Date(dto.birth_date),
        last_name,
        first_name,
        phone,
        photo: avatarUrl,
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

async findAll(filter: QueryStudentDto) {
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

    if (filter.birth_date) {
      where.birth_date = new Date(filter.birth_date);
    }

    return this.prisma.student.findMany({
      where,
      orderBy: { id: 'asc' },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        phone: true,
        address: true,
        birth_date: true,
        status: true,
        photo: true,
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

    await this.prisma.student.update({
      where: { id },
      data: { status: 'inactive' },
    });

    return { message: 'student deleted successfully' };
  }
}
