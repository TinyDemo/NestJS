import { IsNotEmpty, MinLength } from 'class-validator';

export class PassportByPasswordDto {
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
