import { HandlebarsAdapter, MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import * as path from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import mailConfiguration from '../../config/mail';
import databaseConfiguration from '../../config/database';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(databaseConfiguration()),
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
    PassportModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
