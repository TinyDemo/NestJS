import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { EmailVerification } from '../entities/email-verification.entity';
import { Passport } from '../entities/passport.entity';
import { Token } from '../entities/token.entity';
import { User } from '../entities/user.entity';

export default (): TypeOrmModuleOptions => ({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT) || 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSPORT,
  database: process.env.DB_DATABASE,
  timezone: process.env.DB_TIMEZONE,
  entities: [User, Token, Passport, EmailVerification],
  synchronize: 'true' === process.env.DB_SYNCHRONIZE,
});
