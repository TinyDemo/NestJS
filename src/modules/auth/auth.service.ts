import { BadRequestException, forwardRef, Inject, Injectable, Scope, UseFilters } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { Token } from '../../entities/token.entity';
import { User } from '../../entities/user.entity';
import { BadRequestExceptionFilter } from '../../filter/bad-request-exception.filter';
import { UserService } from '../user/user.service';
import { TokenService } from './token.service';

@Injectable({ scope: Scope.REQUEST })
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
    @Inject(REQUEST)
    private readonly req: Request,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  /**
   * 检查邮箱是否被注册
   * @param email
   * @return Promise 已注册：true
   */
  async emailIsExists(email: string): Promise<boolean> {
    const user = await this.userService.findUserByEmail(email);
    return undefined !== user;
  }

  /**
   * 用户登录
   * @param email
   * @param password
   */
  async registerWithEmail(email: string, password: string): Promise<User> {
    const hashPassword = bcrypt.hashSync(password, 10);
    const user = new User();
    user.email = email;
    user.password = hashPassword;
    user.nickname = email.split('@').shift();
    return this.userRepository.save(user);
  }
  @UseFilters(BadRequestExceptionFilter)
  async loginWithEmail(email: string, password: string): Promise<User> {
    const user = await this.userService.findUserByEmail(email);
    if (undefined === user) {
      throw new BadRequestException({
        code: 100001,
        message: '该用户不存在',
      });
    }
    const passwordCheckResult = await this.checkUserPassword(user, password);
    if (!passwordCheckResult) {
      throw new BadRequestException({
        code: 100002,
        message: '密码错误',
      });
    }
    return user;
  }
  async login(user: User): Promise<Token> {
    const token: Token = new Token();
    token.userId = user.id;
    token.token = bcrypt.hashSync(user.email, 10);
    token.ip = this.req.ip;
    token.ua = this.req.get('User-Agent');
    return this.tokenRepository.save(token);
  }
  async logout() {
    return await this.tokenService.destroyCurrentToken();
  }

  /**
   * 校验密码是否正确
   * @param user
   * @param password
   */
  async checkUserPassword(user: User, password: string) {
    return bcrypt.compare(password, user.password);
  }
}
