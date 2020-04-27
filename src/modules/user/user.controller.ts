import { Controller, Delete, Get, HttpCode, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { User } from '../../entities/user.entity';
import { BearerAuthGuard } from '../auth/guards/bearer-auth.guard';
import { PassportAuthGuard } from '../auth/guards/passport-auth.guard';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @UseGuards(BearerAuthGuard)
  @Get('profile')
  profile(@Req() req: Request) {
    const user = <User>req.user;
    return {
      code: 100000,
      message: 'OK',
      data: {
        id: user.id,
      },
    };
  }
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
}
