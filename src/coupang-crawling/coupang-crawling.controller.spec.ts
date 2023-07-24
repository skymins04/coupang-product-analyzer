import { Test, TestingModule } from '@nestjs/testing';
import { CoupangCrawlingController } from './coupang-crawling.controller';
import { CoupangCrawlingService } from './coupang-crawling.service';

describe('CoupangCrawlingController', () => {
  let controller: CoupangCrawlingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoupangCrawlingController],
      providers: [CoupangCrawlingService],
    }).compile();

    controller = module.get<CoupangCrawlingController>(
      CoupangCrawlingController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
