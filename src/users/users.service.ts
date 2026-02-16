import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { UpdateUserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  
  async findAll() {
    return this.prisma.user.findMany();
  }

  async findById(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

async updateUser(id: number, data: UpdateUserDto) {
  await this.findById(id);
  return this.prisma.user.update({
    where: { id },
    data,
  });
}


  async deleteUser(id: number) {
    await this.findById(id); 
    return this.prisma.user.delete({ where: { id } });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }
}
