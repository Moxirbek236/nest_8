import { forwardRef, Module } from '@nestjs/common';
import { StudentsController } from './students.controller';
import { PrismaModule } from 'src/core/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { StudentService } from './students.service';
import { EmailModule } from 'src/common/email/email.module';

@Module({
  imports: [PrismaModule, forwardRef(() => AuthModule), JwtModule, EmailModule],

  controllers: [StudentsController],
  providers: [StudentService],
})
export class StudentsModule {}
