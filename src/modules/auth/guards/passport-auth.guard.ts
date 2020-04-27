import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { User } from '../../../entities/user.entity';
import { PassportService } from '../passport.service';

@Injectable()
export class PassportAuthGuard implements CanActivate {
  constructor(private readonly passportService: PassportService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const user = <User>request.user;
    const credentials = request.body.credentials;
    if (!user || !credentials) {
      return false;
    }
    return await this.passportService.checkPassport(user, credentials);
  }
}
