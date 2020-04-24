import { BadRequestException, HttpException, Injectable, UseFilters } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginWithEmailDto } from './dto/login-with-email.dto';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';
import { BadRequestExceptionFilter } from '../filter/bad-request-exception.filter';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * 检查邮箱是否被注册
   * @param email
   * @return Promise 已注册：true
   */
  async emailIsExists(email: string): Promise<boolean> {
    const count = await this.userRepository
      .createQueryBuilder()
      .where('email=:email', { email: email })
      .getCount();
    return count > 0;
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
  async loginWithEmail(loginWithEmailDto: LoginWithEmailDto) {
    let user: User;
    try {
      user = await this.userRepository.findOneOrFail({ email: loginWithEmailDto.email });
    } catch (e) {
      throw new BadRequestException({
        code: 100001,
        message: '该用户不存在',
      });
    }

    const passwordCheckResult = bcrypt.compareSync(loginWithEmailDto.password, user.password);
    if (!passwordCheckResult) {
      throw new BadRequestException({
        code: 100002,
        message: '密码错误',
      });
    }
  }
}
