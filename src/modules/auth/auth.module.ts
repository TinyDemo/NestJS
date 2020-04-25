import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { Token } from '../../entities/token.entity';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([User, Token]), PassportModule],
  controllers: [AuthController],
  providers: [LocalStrategy, AuthService],
})
export class AuthModule {}
