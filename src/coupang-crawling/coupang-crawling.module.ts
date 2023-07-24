import { Module } from '@nestjs/common';
import { CoupangCrawlingService } from './coupang-crawling.service';
import { CoupangCrawlingController } from './coupang-crawling.controller';

@Module({
  providers: [CoupangCrawlingService],
  exports: [CoupangCrawlingService],
  controllers: [CoupangCrawlingController],
})
export class CoupangCrawlingModule {}
