import { Equals, IsEmail, IsNotEmpty, IsString, Min, MinLength } from 'class-validator';
import { Match } from '../../../validator/math.decorator';

export class RegisterWithEmailDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
  @IsNotEmpty()
  @Match('password')
  passwordConfirmation: string;
}
