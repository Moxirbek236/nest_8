import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Status } from '@prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class RoomsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.room.findMany();
  }

  findAllByStatus(status: Status) {
    return this.prisma.room.findMany({
      where: { status },
    });
  }

  async findOne(id: number) {
    const room = await this.prisma.room.findUnique({
      where: { id },
    });

    if (!room) throw new NotFoundException('Room not found');
    return room;
  }

  async findOneByStatus(id: number, status: Status) {
    const room = await this.prisma.room.findFirst({
      where: { id, status },
    });

    if (!room) throw new NotFoundException('Room not found');
    return room;
  }

  create(dto: CreateRoomDto) {
    return this.prisma.room.create({
      data: dto,
    });
  }

  update(id: number, dto: UpdateRoomDto) {
    return this.prisma.room.update({
      where: { id },
      data: dto,
    });
  }

  remove(id: number) {
    return this.prisma.room.delete({
      where: { id },
    });
  }
}
