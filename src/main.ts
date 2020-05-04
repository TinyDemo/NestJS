import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';
import { AppModule } from './modules/app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { BadRequestExceptionFilter } from './filter/bad-request-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new BadRequestExceptionFilter());
  app.useStaticAssets(path.join('public'), {
    prefix: '/public/',
  });
  await app.listen(3000);
  process.env.URL = await app.getUrl();
  console.log(`${await app.getUrl()}`);
}
bootstrap();
