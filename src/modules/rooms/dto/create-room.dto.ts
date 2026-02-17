import { Status } from '@prisma/client';

export class CreateRoomDto {
  name: string;
  status?: Status;
}
