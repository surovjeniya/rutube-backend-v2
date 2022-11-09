import { IsEmail, Length } from 'class-validator';
import { INCORRECT_EMAIL, INVALID_PASSWORD_LENGTH } from '../const/user.const';

export class CreateUserDto {
  @IsEmail(undefined, {
    message: INCORRECT_EMAIL
  })
  email: string;
  @Length(12, 100, {
    message: INVALID_PASSWORD_LENGTH
  })
  password: string;
}
