import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ContextIdFactory, ModuleRef } from '@nestjs/core';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-http-bearer';
import { Request } from 'express';
import { UserService } from '../../user/user.service';
import { TokenService } from '../token.service';
@Injectable()
export class BearerStrategy extends PassportStrategy(Strategy) {
  constructor(private moduleRef: ModuleRef, private readonly userService: UserService) {
    super({ passReqToCallback: true });
  }
  async validate(request: Request, tokenStr: string) {
    const contextId = ContextIdFactory.getByRequest(request);
    const tokenService = await this.moduleRef.resolve(TokenService, contextId);

    const token = await tokenService.findTokenByTokenStr(tokenStr);
    if (undefined === token) {
      throw new UnauthorizedException();
    }
    const user = await this.userService.findUserById(token.userId);
    if (undefined === user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
