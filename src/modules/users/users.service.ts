import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { UpdateUserDto } from './dto/user.dto';
import { RegisterDto } from 'src/auth/dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { EmailService } from 'src/common/email/email.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  async findAllAdmins() {
    return await this.prisma.user.findMany({
      where: {
        role: 'ADMIN',
      },
    });
  }

  async findByIdAdmin(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id, role: 'ADMIN' },
    });
    if (!user) throw new NotFoundException('Admin not found');
    return user;
  }

  async updateAdmin(id: number, data: UpdateUserDto) {
    await this.findByIdAdmin(id);
    return await this.prisma.user.update({
      where: { id, role: 'ADMIN' },
      data,
    });
  }

  async deleteAdmin(id: number) {
    await this.findByIdAdmin(id);
    return await this.prisma.user.delete({
      where: { id },
    });
    // return await this.prisma.user.update({
    //   where: { id, role: 'ADMIN' },
    //   data: { status: 'inactive' },
    // });
  }

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  async findAllInActiveAdmins() {
    return await this.prisma.user.findMany({
      where: {
        role: 'ADMIN',
        status: 'inactive',
      },
    });
  }

  async findAllActiveAdmins() {
    return await this.prisma.user.findMany({
      where: {
        role: 'ADMIN',
        status: 'active',
      },
    });
  }

  async findAllFreezeAdmins() {
    return await this.prisma.user.findMany({
      where: {
        role: 'ADMIN',
        status: 'freeze',
      },
    });
  }

  async findByPhone(phone: string) {
    return await this.prisma.user.findUnique({ where: { phone } });
  }

  async uploadAvatar(file: any): Promise<string> {
    const filePath = `uploads/${file.filename}`;
    return filePath;
  }

  async createAdmin(dto: RegisterDto, photo: Express.Multer.File) {
    this.emailService.sendVerificationEmail(dto.email, dto.email, dto.password);
    const existingUser = await this.findByEmail(dto.email);
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const existingPhone = await this.findByPhone(dto.phone);
    if (existingPhone) {
      throw new BadRequestException('Phone number already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const avatarUrl = photo ? await this.uploadAvatar(photo) : null;


    return await this.prisma.user.create({
      data: {
        first_name: dto.first_name,
        last_name: dto.last_name,
        email: dto.email,
        phone: dto.phone,
        address: dto.address,
        photo: avatarUrl,
        password: passwordHash,
        role: 'ADMIN',
      },
    });
  }
}
