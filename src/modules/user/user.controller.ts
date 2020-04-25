import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller('user')
export class UserController {
  @Get('profile')
  profile(@Req() req: Request) {
    return req.body;
  }
}
