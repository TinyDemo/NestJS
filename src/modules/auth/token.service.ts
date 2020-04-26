import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { Token } from '../../entities/token.entity';

@Injectable({ scope: Scope.REQUEST })
export class TokenService {
  constructor(
    @Inject(REQUEST)
    private readonly req: Request,
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
  ) {}

  /**
   * 根据 tokenStr 查询 token 对象
   * @param tokenStr
   */
  async findTokenByTokenStr(tokenStr: string): Promise<Token | undefined> {
    return this.tokenRepository.findOne({ token: tokenStr });
  }

  /**
   * 从 request 中解析 token
   */
  async parseTokenFromRequest(): Promise<Token | undefined> {
    let credentials: string = '';
    if (this.req.headers && this.req.headers.authorization) {
      const parts = this.req.headers.authorization.split(' ');
      if (parts.length === 2 && 'Bearer' === parts[0]) {
        credentials = parts[1];
      }
    }
    if (this.req.body && this.req.body.access_token) {
      credentials = this.req.body.access_token;
    }
    if (this.req.query && this.req.query.access_token) {
      credentials = <string>this.req.query.access_token;
    }
    return this.findTokenByTokenStr(credentials);
  }

  /**
   * 注销当前用户的登录
   */
  async destroyCurrentToken() {
    const token = await this.parseTokenFromRequest();
    return this.tokenRepository.softDelete(token.id);
  }
}
