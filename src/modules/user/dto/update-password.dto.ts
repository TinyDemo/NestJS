import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Match } from '../../../validator/math.decorator';

export class UpdatePasswordDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
  @Match('password')
  passwordConfirmation: string;
}
