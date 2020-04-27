import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { User } from '../../entities/user.entity';
import { PassportByPasswordDto } from './dto/passport-by-password.dto';
import { BearerAuthGuard } from './guards/bearer-auth.guard';
import { Request } from 'express';
import { PassportService } from './passport.service';

@Controller('auth/passport')
export class PassportController {
  constructor(private readonly passportService: PassportService) {}
  @UseGuards(BearerAuthGuard)
  @Post('by-passport')
  async byPassword(@Req() req: Request, @Body() passportByPasswordDto: PassportByPasswordDto) {
    const passport = await this.passportService.generatePassportByPassword(<User>req.user, passportByPasswordDto.password);
    return {
      code: 100000,
      message: 'OK',
      data: {
        credentials: passport.credentials,
      },
    };
  }
}
