import { Global, Module } from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { TeachersController } from './teachers.controller';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/core/prisma/prisma.module';
import { EmailModule } from 'src/common/email/email.module';

@Global()
@Module({
  imports: [AuthModule, PrismaModule, EmailModule],
  controllers: [TeachersController],
  providers: [TeachersService],
})
export class TeachersModule {}
