import {
  BadRequestException,
  Body,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/auth.dto';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async register(@Body() dto) {
    const existing = await this.prisma.staff.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new BadRequestException("Email allaqachon ro'yxatdan o'tgan");
    }

    const hashed = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.staff.create({
      data: {
        email: dto.email,
        username: dto.username,
        password: hashed,
        firstName: dto.firstName,
        position: dto.position,
        role: dto.role,
        lastName: dto.lastName,
      },
    });

    const token = this.jwtService.sign({ sub: user.id, email: user.email, role : user.role });

    return { user, token };
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const payload = { id: user.id, email: user.email };
    return { access_token: this.jwtService.sign(payload) };
  }
}
