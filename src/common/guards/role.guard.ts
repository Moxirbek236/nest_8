import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  
  canActivate(context: ExecutionContext): boolean {
    
    const requiredRoles = this.reflector.get("roles", context.getHandler()) || this.reflector.get("roles", context.getClass());
        
    const request = context.switchToHttp().getRequest();
    if(!requiredRoles.includes(request["user"].role)) {      
      throw new ForbiddenException('Access denied');
    }
    return true;
  }
}
