import { Body, Controller, Delete, Get, HttpCode, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { IsNotEmpty } from 'class-validator';
import { Request } from 'express';
import { User } from '../../entities/user.entity';
import { BearerAuthGuard } from '../auth/guards/bearer-auth.guard';
import { PassportAuthGuard } from '../auth/guards/passport-auth.guard';
import { AllowUserUpdateProfileDto } from './dto/allow-user-update-profile.dto';
import { VerifyCodeStyleEmailVerificationDto } from './dto/verify-code-style-email-verification.dto';
import { EmailVerificationService } from './email-verification.service';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly emailVerificationService: EmailVerificationService,
  ) {}

  /**
   * 获取用户的个人信息
   * @param req
   */
  @UseGuards(BearerAuthGuard)
  @Get('profile')
  profile(@Req() req: Request) {
    const user = <User>req.user;
    return {
      code: 100000,
      message: 'OK',
      data: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        avatar: user.avatar,
      },
    };
  }

  /**
   * 注销用户账号，需要一个 Passport
   * @param req
   */
  @UseGuards(BearerAuthGuard, PassportAuthGuard)
  @Delete('delete')
  @HttpCode(200)
  async delete(@Req() req: Request) {
    const user = <User>req.user;
    await this.userService.delete(user);
    return {
      code: 100000,
      message: 'OK',
    };
  }

  /**
   * 请求验证邮箱有效性的验证码
   * @param req
   */
  @UseGuards(BearerAuthGuard)
  @Get('request-code-style-email-verification')
  async requestCodeStyleEmailVerification(@Req() req: Request) {
    const user = <User>req.user;
    await this.emailVerificationService.sendCodeStyleEmailVerification(user);
    return {
      code: 100000,
      message: 'OK',
    };
  }

  @UseGuards(BearerAuthGuard)
  @Post('verify-code-style-email-verification')
  async verifyCodeStyleEmailVerification(@Req() req: Request, @Body() body: VerifyCodeStyleEmailVerificationDto) {
    const user = <User>req.user;
    const checkedResult = await this.emailVerificationService.verifyCodeStyleEmailVerification(user, body.token);
    if (checkedResult) {
      return {
        code: 100000,
        message: 'OK',
      };
    } else {
      return {
        code: 100001,
        message: '校验失败',
      };
    }
  }
  @UseGuards(BearerAuthGuard)
  @Patch('profile')
  async updateProfile(@Req() req: Request, @Body() body: AllowUserUpdateProfileDto) {
    await this.userService.updateProfile(<User>req.user, body);
    return {
      code: 100000,
      message: 'OK',
    };
  }
}
