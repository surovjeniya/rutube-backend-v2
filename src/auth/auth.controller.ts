import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { AuthResponse } from './types/auth.types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: CreateUserDto): Promise<AuthResponse> {
    const token = await this.authService.register(dto);
    return token;
  }

  @Post('login')
  async login(@Body() dto: CreateUserDto): Promise<AuthResponse> {
    const token = await this.authService.login(dto);
    return token;
  }
}
