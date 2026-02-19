import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { PrismaModule } from 'src/core/prisma/prisma.module';
import { StudentGroupModule } from './student-group/student-group.module';

@Module({
  controllers: [GroupsController],
  providers: [GroupsService],
  imports: [StudentGroupModule, PrismaModule],
})
export class GroupsModule {}
