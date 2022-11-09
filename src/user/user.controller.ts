import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Patch,
  Delete,
  UseGuards,
  NotFoundException,
  HttpStatus,
  HttpException
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { JwtPayload } from 'src/auth/types/auth.types';
import { USER_NOT_FOUND } from './const/user.const';
import { User } from './decorator/user.decorator';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //Create User
  @Post()
  createUser(@Body() dto: CreateUserDto) {
    return this.userService.createUser(dto);
  }

  //Get Profile
  @Get('get-profile')
  // @UseGuards(new AuthGuard())
  async getProfile(@User() user: JwtPayload) {
    const profile = await this.userService.getUserById(user.id);
    if (!profile) {
      throw new HttpException(USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return profile;
  }

  //Get All Users
  @Get('get-all')
  async getAllUsers() {
    const users = await this.userService.getAll();
    return users;
  }

  //Get User By Id
  @Get('by-id/:id')
  getUserById(@Param('id') id: string) {
    const user = this.userService.getUserById(Number(id));
    return user;
  }

  //Get User By Email
  @Get('by-email/:email')
  getUserByEmail(@Param('email') email: string) {
    const user = this.userService.getUserByEmail(email);
    return user;
  }

  // Update User
  @Patch('')
  @UseGuards(new AuthGuard())
  updateUser(@Body() dto: UpdateUserDto, @User() user: JwtPayload) {
    return this.userService.updateUser(dto, user);
  }

  //Delete User
  @Delete('')
  @UseGuards(new AuthGuard())
  async deleteUser(@User() user: JwtPayload) {
    const deletedUser = await this.userService.deleteUser(user);
    if (!deletedUser) {
      return {
        message: 'User not found'
      };
    } else {
      return {
        message: `User ${user.email} will be deleted`
      };
    }
  }

  //Subscribe and Unsubscribe
  @UseGuards(new AuthGuard())
  @Patch('subscribe/:to')
  async subscribe(@Param('to') to: string, @User() user: JwtPayload) {
    const subrcription = await this.userService.subscribe(user.id, Number(to));
    return subrcription;
  }
}
