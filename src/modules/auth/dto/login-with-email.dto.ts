import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginWithEmailDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
