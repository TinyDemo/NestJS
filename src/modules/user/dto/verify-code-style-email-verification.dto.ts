import { IsNotEmpty } from 'class-validator';

export class VerifyCodeStyleEmailVerificationDto {
  @IsNotEmpty()
  token: string;
}
