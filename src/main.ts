import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import axios from 'axios';

async function bootstrap() {
  axios.defaults.headers.common[
    'Accept'
  ] = `text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7`;
  axios.defaults.headers.common[
    'User-Agent'
  ] = `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36`;
  axios.defaults.headers.common['Accept-Language'] = `ko-KR,ko;q=0.9`;
  axios.defaults.headers.common['Cookie'] = '';

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('쿠팡 상품 분석기')
    .setDescription('쿠팡 상품을 분석해주는 API 서비스입니다.')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  process.env.RELEASE_ENV === 'development' &&
    SwaggerModule.setup('docs', app, document);

  await app.listen(3000);
}
bootstrap();
