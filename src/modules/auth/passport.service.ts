import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Passport } from '../../entities/passport.entity';
import { User } from '../../entities/user.entity';
import { AuthService } from './auth.service';
import * as bcrpyt from 'bcrypt';

@Injectable()
export class PassportService {
  constructor(
    @InjectRepository(Passport)
    private readonly passportRepository: Repository<Passport>,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
  ) {}

  async generatePassportByPassword(user: User, password: string) {
    if (!(await this.authService.checkUserPassword(user, password))) {
      throw new BadRequestException(['密码错误']);
    }
    return this.generatePassport(user);
  }
  async checkPassport(user: User, credentials: string) {
    const passport = await this.passportRepository.findOne({ userId: user.id, credentials: credentials });
    if (undefined === passport) {
      return false;
    }
    await this.passportRepository.remove(passport);
    return true;
  }

  /**
   * 删除指定用户的所有凭证
   * @param user
   */
  async deleteAllPassport(user: User): Promise<DeleteResult> {
    return this.passportRepository
      .createQueryBuilder()
      .delete()
      .where({ user_id: user.id })
      .execute();
  }
  private async generatePassport(user: User) {
    const credentials = await bcrpyt.genSalt(10);
    const hashedCredentials = await bcrpyt.hash(credentials, 10);
    const passport = new Passport();
    passport.userId = user.id;
    passport.credentials = hashedCredentials;
    return this.passportRepository.save(passport);
  }
}
