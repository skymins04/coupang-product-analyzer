import { Module } from '@nestjs/common';
import { CoupangCrawlingModule } from './coupang-crawling/coupang-crawling.module';

@Module({
  imports: [CoupangCrawlingModule],
})
export class AppModule {}
