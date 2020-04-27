import { forwardRef, Module } from '@nestjs/common';
import { Passport } from '../../entities/passport.entity';
import { Token } from '../../entities/token.entity';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { PassportController } from './passport.controller';
import { PassportService } from './passport.service';
import { BearerStrategy } from './strategies/bearer.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { TokenService } from './token.service';

@Module({
  imports: [ TypeOrmModule.forFeature([User, Token, Passport]), forwardRef(() => UserModule)],
  controllers: [AuthController, PassportController],
  providers: [AuthService, TokenService, PassportService, LocalStrategy, BearerStrategy],
  exports: [TokenService, PassportService],
})
export class AuthModule {}
