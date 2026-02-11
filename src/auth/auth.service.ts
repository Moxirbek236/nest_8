import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "src/users/users.service";
import * as bcrypt from 'bcrypt';
import { RegisterDto } from "./dto/auth.dto";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(dto:RegisterDto) {
    const hashed = await bcrypt.hash(dto.password, 10);

    const user = await this.usersService.createUser({username:dto.username, password:hashed, email:dto.email});

    const payload = { id: user.id, email: user.email };
    const access_token = this.jwtService.sign(payload);

    return { access_token };
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
