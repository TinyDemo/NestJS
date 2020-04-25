import { Body, Controller, HttpCode, Post, Req, Res, UseGuards } from '@nestjs/common';
import { User } from '../../entities/user.entity';
import { RegisterWithEmailDto } from './dto/register-with-email.dto';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { LoginWithEmailDto } from './dto/login-with-email.dto';
import { LocalAuthGuard } from './local-auth.guard';

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

  /**
   * 邮箱登录
   * @param req
   * @param loginWithEmailDto
   */
  @UseGuards(LocalAuthGuard)
  @Post('login/email')
  @HttpCode(200)
  async loginWithEmail(@Req() req: Request, @Body() loginWithEmailDto: LoginWithEmailDto) {
    const token = await this.authService.login(<User>req.user);

    return {
      code: 100000,
      message: 'OK',
      data: {
        token: token.token,
      },
    };
  }
}
