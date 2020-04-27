import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Passport } from '../../entities/passport.entity';
import { User } from '../../entities/user.entity';
import { AuthService } from './auth.service';
import * as bcrpyt from 'bcrypt';

@Injectable()
export class PassportService {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(Passport)
    private readonly passportRepository: Repository<Passport>,
  ) {}
  async byPassword(user: User, password: string) {
    if (!(await this.authService.checkUserPassword(user, password))) {
      throw new BadRequestException(['密码错误']);
    }
    return this.generatePassport(user);
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
