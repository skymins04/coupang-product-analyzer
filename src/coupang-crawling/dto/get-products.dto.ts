import { ApiProperty } from '@nestjs/swagger';

export class GetProductsDTO {
  @ApiProperty({
    example: '1234567',
    description: '쿠팡 상품 ID',
  })
  id: string;
  @ApiProperty({
    example: '신형 스마트 워터탭',
    description: '쿠팡 상품명',
  })
  name: string;
  @ApiProperty({
    example: 12345,
    description: '쿠팡 상품 판매가',
  })
  price: number;
  @ApiProperty({
    example: 12345,
    description: '쿠팡 상품 할인 이전 원가',
  })
  originalPrice: number;
  @ApiProperty({
    example: 25,
    description: '쿠팡 상품 할인률',
  })
  dcRate: number;
  @ApiProperty({
    example: 'https://example.com/example.png',
    description: '쿠팡 상품 썸네일 URL',
  })
  thumbnail: string;
  @ApiProperty({
    example: 4.5,
    description: '쿠팡 상품 별점 (0~5 사이 실수)',
  })
  rating: number;
  @ApiProperty({
    example: 123,
    description: '쿠팡 상품 상품평 개수',
  })
  reviewCount: number;
  @ApiProperty({
    example: false,
    description: '쿠팡 상품 품절 여부',
  })
  isSoldOut: boolean;
  @ApiProperty({
    example: 'https://www.coupang.com/vp/products/1234567',
    description: '쿠팡 상품 상세페이지 URL',
  })
  url: string;
}

export type CoupangProductSorter =
  | 'scoreDesc' // 쿠팡 랭킹순
  | 'salePriceAsc' // 낮은 가격순
  | 'salePriceDesc' // 높은 가격순
  | 'saleCountDesc' // 판매량순
  | 'latestAsc'; // 최신순

export class GetProductsRequestDTO {
  @ApiProperty({
    example: '신형 스마트 워터탭',
    description: '검색 키워드',
    required: true,
  })
  keywords: string;
  @ApiProperty({
    example: 1,
    description: '페이지',
    required: false,
  })
  page?: number;
  @ApiProperty({
    example: 'scoreDesc',
    description:
      '정렬방식 (scoreDesc: 쿠팡 랭킹순, salePriceAsc: 낮은 가격순, salePriceDesc: 높은 가격순, saleCountDesc: 판매량순, latestAsc: 최신순)',
    required: false,
  })
  sorter?: CoupangProductSorter;
}
