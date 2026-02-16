import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { UpdateUserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

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
    return await this.prisma.user.delete({ where: { id, role: 'ADMIN' } });
  }

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({ where: { email } });
  }
}
