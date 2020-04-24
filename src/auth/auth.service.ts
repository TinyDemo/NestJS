import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

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
  async registerWithEmail(email: string, password: string): Promise<User> {
    const hashPassword = bcrypt.hashSync(password, 10);
    const user = new User();
    user.email = email;
    user.password = hashPassword;
    user.nickname = email.split('@').shift();
    return this.userRepository.save(user);
  }
}
