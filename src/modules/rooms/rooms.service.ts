import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Status } from '@prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { QueryRoomDto } from './dto/query.dto';

@Injectable()
export class RoomsService {
  constructor(private prisma: PrismaService) {}

  async findAll(filter: QueryRoomDto) {
    const where: any = {};

    if (filter.name) {
      where.name = { contains: filter.name, mode: 'insensitive' };
    }

    if (filter.status) {
      where.status = filter.status;
    }

    return this.prisma.room.findMany({
      where,
      orderBy: { id: 'asc' },
    });
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

  async create(dto: CreateRoomDto) {
    return await this.prisma.room.create({
      data: dto,
    });
  }

  async update(id: number, dto: UpdateRoomDto) {
    return await this.prisma.room.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    await this.prisma.room.update({
      where: { id },
      data: { status: 'inactive' },
    });
  }
}
