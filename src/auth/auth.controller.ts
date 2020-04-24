import { Body, Controller, Post } from '@nestjs/common';
import { RegisterWithEmailDto } from './registerWithEmail.dto';

@Controller('auth')
export class AuthController {
  @Post('register/email')
  registerWithEmail(@Body() registerWithEmailDto: RegisterWithEmailDto) {
    return registerWithEmailDto;
  }
  @Post('login/email')
  loginWithEmail() {}
}
