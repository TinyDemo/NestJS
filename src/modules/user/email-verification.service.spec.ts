import { forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailVerification } from '../../entities/email-verification.entity';
import { User } from '../../entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { EmailVerificationService } from './email-verification.service';
import { UserController } from './user.controller';

import { UserService } from './user.service';

describe('EmailVerificationService', () => {
  let emailVerificationService: EmailVerificationService;
  let userService: UserService;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: 'localhost',
          port: 3306,
          username: 'root',
          password: 'root',
          database: 'nestjs',
          timezone: '+0800',
          entities: ['dist/**/*.entity.js'],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([User, EmailVerification]),
        forwardRef(() => AuthModule),
      ],
      controllers: [],
      providers: [UserService, EmailVerificationService],
    }).compile();
    emailVerificationService = moduleRef.get<EmailVerificationService>(EmailVerificationService);
    userService = moduleRef.get<UserService>(UserService);
  });
  describe('root', () => {
    it('should return "Hello World!"', async () => {
      const user = await userService.findUserByEmail('liuzhaowei55@sina.com');
      const output = expect(emailVerificationService.generateEmailVerification(user));
      console.log(output);
    });
  });
});
