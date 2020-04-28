import { HandlebarsAdapter, MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import mailConfiguration from '../../config/mail';

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forRoot(),
    ConfigModule.forRoot(),
    MailerModule.forRoot({
      transport: mailConfiguration(),
      template: {
        dir: __dirname + '/../../templates',
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
