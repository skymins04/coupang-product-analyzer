import { Test, TestingModule } from '@nestjs/testing';
import { CoupangCrawlingService } from './coupang-crawling.service';
import axios from 'axios';
import {
  GET_KEYWORD_INFO_MOCK_EMPTY_RESULT,
  GET_KEYWORD_INFO_MOCK_RESULT,
  GET_PRODUCTS_MOCK_RESULT,
} from './mock-data';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('CoupangCrawlingService', () => {
  let service: CoupangCrawlingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoupangCrawlingService],
    }).compile();

    service = module.get<CoupangCrawlingService>(CoupangCrawlingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getKeywordInfo()', () => {
    it('isEmpty === true && pageCount === 0', async () => {
      mockedAxios.get.mockResolvedValueOnce(GET_KEYWORD_INFO_MOCK_EMPTY_RESULT);
      const result = await service.getKeywordInfo(
        'isEmpty === true && pageCount === 0',
      );
      expect(result.isEmpty).toBe(true);
      expect(result.pageCount).toBe(0);
    });

    it('isEmpty === false && pageCount === 3', async () => {
      mockedAxios.get.mockResolvedValueOnce(GET_KEYWORD_INFO_MOCK_RESULT);
      const result = await service.getKeywordInfo(
        'isEmpty === false && pageCount === 3',
      );
      expect(result.isEmpty).toBe(false);
      expect(result.pageCount).toBe(3);
    });
  });

  describe('getProducts()', () => {
    it('shoud be parse products', async () => {
      mockedAxios.get.mockResolvedValueOnce(GET_PRODUCTS_MOCK_RESULT);
      const result = await service.getProducts('asdf', 1);
      expect(result.length).toBe(72);
    });
  });
});
