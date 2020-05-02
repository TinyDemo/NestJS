import { MaxLength, MinLength } from 'class-validator';

export class AllowUserUpdateProfileDto {
  @MinLength(3)
  @MaxLength(16)
  nickname: string;
}
