import { Equals, IsEmail, IsString, Min, MinLength } from 'class-validator';
import { Match } from '../validator/math.decorator';

export class RegisterWithEmailDto {
  @IsEmail()
  email: string;
  @IsString()
  @MinLength(6)
  password: string;
  @Match('password')
  passwordConfirmation: string;
}
