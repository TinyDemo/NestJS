import { Body, Controller, HttpException, Post, Res } from '@nestjs/common';
import { RegisterWithEmailDto } from './registerWithEmail.dto';
import { AuthService } from './auth.service';
import { Response } from 'express';

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
  loginWithEmail() {}
}
