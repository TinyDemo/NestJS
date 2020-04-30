import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailVerification } from '../../entities/email-verification.entity';
import { User } from '../../entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { EmailVerificationService } from './email-verification.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, EmailVerification]), forwardRef(() => AuthModule)],
  controllers: [UserController],
  providers: [UserService, EmailVerificationService],
  exports: [UserService],
})
export class UserModule {}
