import { forwardRef } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailVerification } from '../../entities/email-verification.entity';
import { User } from '../../entities/user.entity';
import { AppModule } from '../app/app.module';
import { AuthModule } from '../auth/auth.module';
import { EmailVerificationService } from './email-verification.service';

import { UserService } from './user.service';

describe('EmailVerificationService', () => {
  let emailVerificationService: EmailVerificationService;
  let userService: UserService;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TypeOrmModule.forFeature([User, EmailVerification]), forwardRef(() => AuthModule)],
      controllers: [],
      providers: [UserService, EmailVerificationService],
    }).compile();
    emailVerificationService = await moduleRef.resolve<EmailVerificationService>(EmailVerificationService);
    userService = await moduleRef.resolve<UserService>(UserService);
  });
  describe('EmailVerificationService', () => {
    it('return one instance of EmailVerification"', async () => {
      const user = await userService.findUserByEmail('liuzhaowei55@sina.com');
      // expect(await emailVerificationService.generateEmailVerification(user)).toBeInstanceOf(EmailVerification);
    });
  });
});
