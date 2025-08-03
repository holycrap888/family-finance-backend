import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    if (!authHeader) throw new UnauthorizedException('No authorization header');
    const token = authHeader.split(' ')[1];
    if (!token) throw new UnauthorizedException('No token provided');
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
      request.user = decoded;
      return !!decoded;
    } catch (err) {
      Logger.error('JWT verification failed', err);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
