import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../auth.service';
import { AuthRequest } from '../types/auth.types';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}
  async use(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const user = await this.authService.verifyToken(token);
      req.user = user;
      next();
    } catch (e) {
      next();
    }
  }
}
