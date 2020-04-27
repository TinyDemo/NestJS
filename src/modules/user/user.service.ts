import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { PassportService } from '../auth/passport.service';
import { TokenService } from '../auth/token.service';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly tokenService: TokenService,
    private readonly passportService: PassportService,
  ) {}

  /**
   * 获取指定 email 用户
   * @param email
   */
  async findUserByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ email: email });
  }
  async findUserById(id: number): Promise<User | undefined> {
    return this.userRepository.findOne({ id: id });
  }

  /**
   * 删除用户
   * @param user
   */
  async delete(user: User): Promise<boolean> {
    await this.passportService.deleteAllPassport(user);
    await this.tokenService.deleteAllToken(user);
    await this.userRepository.remove(user);
    return true;
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }
}
