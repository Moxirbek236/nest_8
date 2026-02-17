import { PartialType } from '@nestjs/swagger';
import { RegisterDto } from 'src/auth/dto/auth.dto';


export class UpdateTeacherDto extends PartialType(RegisterDto) {}
