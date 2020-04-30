import { HandlebarsAdapter, MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { EmailVerification } from '../../entities/email-verification.entity';
import { Passport } from '../../entities/passport.entity';
import { Token } from '../../entities/token.entity';
import { User } from '../../entities/user.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import mailConfiguration from '../../config/mail';

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'nestjs',
      timezone: '+0800',
      entities: [User, EmailVerification, Passport, Token],
      synchronize: true,
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    MailerModule.forRoot({
      transport: mailConfiguration(),
      template: {
        dir: __dirname + '/../../templates/mail',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
