import { Controller, Get, Query } from '@nestjs/common';
import {
  GetKeywordInfoDTO,
  GetKeywordInfoRequestDTO,
  GetProductsDTO,
  GetProductsRequestDTO,
} from './dto';
import { CoupangCrawlingService } from './coupang-crawling.service';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import {
  GetProductReviewDTO,
  GetProductReviewRequestDTO,
} from './dto/get-product-review.dto';

@Controller('coupang-crawling')
export class CoupangCrawlingController {
  constructor(private readonly service: CoupangCrawlingService) {}

  @ApiOperation({ summary: '쿠팡 키워드 정보 조회' })
  @ApiOkResponse({
    type: GetKeywordInfoDTO,
  })
  @Get('keyword-info')
  async getKeywordInfo(
    @Query() { keywords }: GetKeywordInfoRequestDTO,
  ): Promise<GetKeywordInfoDTO> {
    const result = await this.service.getKeywordInfo(keywords);
    return result;
  }

  @ApiOperation({ summary: '쿠팡 키워드 상품 목록 조회' })
  @ApiOkResponse({
    type: [GetProductsDTO],
  })
  @Get('products')
  async getProducts(
    @Query()
    { keywords, page = 1, sorter = 'scoreDesc' }: GetProductsRequestDTO,
  ): Promise<GetProductsDTO[]> {
    const result = await this.service.getProducts(keywords, page, sorter);
    return result;
  }

  @ApiOperation({ summary: '쿠팡 상품 리뷰 목록 획득' })
  @ApiOkResponse({
    type: [GetProductReviewDTO],
  })
  @Get('reviews')
  async getProductReviews(
    @Query()
    { productId, page, sortBy, rating }: GetProductReviewRequestDTO,
  ): Promise<GetProductReviewDTO[]> {
    const result = await this.service.getProductReviews(productId, {
      page,
      sortBy,
      rating,
    });
    return result;
  }
}
