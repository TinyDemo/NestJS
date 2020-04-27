import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy } from 'passport-http-bearer';
import { Repository } from 'typeorm';
import { Token } from '../../../entities/token.entity';
import { User } from '../../../entities/user.entity';

@Injectable()
export class BearerStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super();
  }

  async validate(tokenStr: string) {
    const token = await this.tokenRepository.findOne({ token: tokenStr });
    if (undefined === token) {
      throw new UnauthorizedException();
    }
    const user = await this.userRepository.findOne({ id: token.userId });
    if (undefined === user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
