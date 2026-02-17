import { Status } from '@prisma/client';

export class UpdateRoomDto {
  name?: string;
  status?: Status;
}
