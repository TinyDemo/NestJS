import { Body, Controller, Post, Res } from '@nestjs/common';
import { RegisterWithEmailDto } from './dto/register-with-email.dto';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { LoginWithEmailDto } from './dto/login-with-email.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 邮箱注册
   * @param registerWithEmailDto
   * @param res
   */
  @Post('register/email')
  async registerWithEmail(@Body() registerWithEmailDto: RegisterWithEmailDto, @Res() res: Response) {
    const emailIsExists = await this.authService.emailIsExists(registerWithEmailDto.email);
    if (emailIsExists) {
      res.status(400).send({
        code: 100001,
        message: '该邮箱已被注册',
      });
      return;
    }

    await this.authService.registerWithEmail(registerWithEmailDto.email, registerWithEmailDto.password);
    res.status(201).send({
      code: 100000,
      message: 'OK',
    });
    return;
  }
  @Post('login/email')
  async loginWithEmail(@Body() loginWithEmailDto: LoginWithEmailDto) {
    await this.authService.loginWithEmail(loginWithEmailDto);
  }
}
