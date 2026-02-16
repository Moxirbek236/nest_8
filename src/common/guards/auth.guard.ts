import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers['authorization'];

    if (!authHeader) return false;

    const [type, token] = authHeader.split(' ');
    
    if (type !== 'Bearer' || !token) return false;

    try {
      const payload = await this.jwtService.verify(token);
      request['user'] = payload;
      return true;
    } catch (err) {
      return false;
    }
  }
}
