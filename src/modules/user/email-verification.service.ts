import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailVerification } from '../../entities/email-verification.entity';
import { User } from '../../entities/user.entity';
import * as bcrypt from 'bcrypt';
import base64url from 'base64url';
import { differenceInMinutes } from 'date-fns';

@Injectable()
export class EmailVerificationService {
  // 邮箱验证码的有效期，单位：分钟
  private static emailVerificationCodeExpire: number = 30;
  constructor(
    @InjectRepository(EmailVerification)
    private readonly emailVerificationRepository: Repository<EmailVerification>,
    private readonly mailerService: MailerService,
  ) {}
  async sendCodeStyleEmailVerification(user: User): Promise<boolean> {
    const emailVerification = await this.generateEmailVerification(user);
    this.mailerService
      .sendMail({
        to: user.email, // list of receivers
        from: 'noreply@nestjs.com', // sender address
        subject: '欢迎使用 NestJS.', // Subject line
        template: 'welcome',
        context: {
          token: emailVerification.token,
        },
      })
      .then(() => {
        console.log('OK');
      })
      .catch(() => {
        console.log('Error');
      });
    return true;
  }
  async verifyCodeStyleEmailVerification(user: User, token: string) {
    const emailVerification = await this.emailVerificationRepository.findOne({
      userId: user.id,
      email: user.email,
      token: token,
    });
    if (undefined === emailVerification) {
      return false;
    }
    return differenceInMinutes(emailVerification.createdAt, new Date()) <= 30;
  }

  /**
   * 生成用户 Email 验证信息
   * @param user
   */
  private async generateEmailVerification(user: User): Promise<EmailVerification> {
    const salt = bcrypt.genSaltSync(10);
    const token = base64url.encode(salt);
    const emailVerification = new EmailVerification();
    emailVerification.userId = user.id;
    emailVerification.email = user.email;
    emailVerification.token = token;

    return this.emailVerificationRepository.save(emailVerification);
  }
}
