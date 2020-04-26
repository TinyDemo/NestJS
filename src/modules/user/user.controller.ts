import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { User } from '../../entities/user.entity';
import { BearerAuthGuard } from '../auth/guards/bearer-auth.guard';

@Controller('user')
export class UserController {
  @UseGuards(BearerAuthGuard)
  @Get('profile')
  profile(@Req() req: Request) {
    console.log(req);
    const user = <User>req.user;
    return { id: user.id };
  }
}
