import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/auth.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { AuthGuard } from 'src/common/guards/auth.guard';
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.TEACHER)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get(`me`)
  async getMe(@Req() req) {
    console.log(req);

    return this.authService.getMe(req.user.id);
  }
}
