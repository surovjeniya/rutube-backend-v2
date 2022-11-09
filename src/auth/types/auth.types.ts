import { Request, Response, NextFunction } from 'express';

export interface JwtPayload {
  email: string;
  id: number;
  isVerified: boolean;
}

export interface AuthResponse {
  token: string;
}

export interface AuthRequest extends Request {
  user: JwtPayload;
}
