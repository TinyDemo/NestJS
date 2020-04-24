import { Module } from '@nestjs/common';
import { Token } from '../../entities/token.entity';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([User, Token])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
