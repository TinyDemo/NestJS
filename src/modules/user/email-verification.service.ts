import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailVerification } from '../../entities/email-verification.entity';
import { User } from '../../entities/user.entity';
import * as bcrypt from 'bcrypt';
import base64url from 'base64url';

@Injectable()
export class EmailVerificationService {
  constructor(
    @InjectRepository(EmailVerification)
    private readonly emailVerificationRepository: Repository<EmailVerification>,
  ) {}

  /**
   * 生成用户 Email 验证信息
   * @param user
   */
  async generateEmailVerification(user: User) {
    const salt = bcrypt.genSaltSync(10);
    const token = base64url.encode(salt);
    const emailVerification = new EmailVerification();
    emailVerification.userId = user.id;
    emailVerification.email = user.email;
    emailVerification.token = token;

    return this.emailVerificationRepository.save(emailVerification);
  }
}
