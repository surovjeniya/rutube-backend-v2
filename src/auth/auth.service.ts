import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserEntity } from 'src/user/entity/user.entity';
import { UserService } from 'src/user/user.service';
import {
  ALREADY_REGISTERED,
  INVALID_EMAIL,
  INCORRECT_PASSWORD
} from './const/auth.const';
import { AuthResponse, JwtPayload } from './types/auth.types';
import { compare } from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async register(dto: CreateUserDto): Promise<AuthResponse> {
    const candidate = await this.userService.getUserByEmail(dto.email);
    if (candidate) {
      throw new HttpException(ALREADY_REGISTERED, HttpStatus.BAD_REQUEST);
    }
    const user = await this.userService.createUser(dto);
    const token = await this.getAccessToken(user);
    return {
      token
    };
  }

  async login(dto: CreateUserDto): Promise<AuthResponse> {
    const user = await this.userService.getUserByEmail(dto.email);
    if (!user) {
      throw new HttpException(INVALID_EMAIL, HttpStatus.BAD_REQUEST);
    }
    const comparePassword = await compare(dto.password, user.password);
    if (!comparePassword) {
      throw new HttpException(INCORRECT_PASSWORD, HttpStatus.BAD_REQUEST);
    }
    const token = await this.getAccessToken(user);
    return {
      token
    };
  }

  async getAccessToken({ email, id, isVerified }: UserEntity): Promise<string> {
    const payload: JwtPayload = {
      email,
      id,
      isVerified
    };
    const token = await this.jwtService.signAsync(payload);
    return token;
  }

  async verifyToken(token: string): Promise<JwtPayload> {
    const user = await this.jwtService.verifyAsync(token);
    return user;
  }
}
