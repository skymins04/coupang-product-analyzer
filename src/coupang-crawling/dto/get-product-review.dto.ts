import { ApiProperty } from '@nestjs/swagger';

export type CoupangProductReviewSortBy = 'DATE_DESC' | 'ORDER_SCORE_ASC';

export class GetProductReviewDTO {
  @ApiProperty({
    example: '2023.07.28',
    description: '리뷰 등록 일자',
  })
  createdAt: string;
  @ApiProperty({
    example: [
      'https://example.com/example.png',
      'https://example.com/example.png',
    ],
    description: '리뷰 첨부파일 URL 배열',
  })
  attachmentURLs: string[];
  @ApiProperty({
    example: 5,
    description: '리뷰 점수 (1 ~ 5 사이의 정수)',
  })
  rating: number;
  @ApiProperty({
    example: '블라블라 리뷰 코맨트',
    description: '리뷰 코맨트',
  })
  comment: string;
}

export class GetProductReviewRequestDTO {
  @ApiProperty({
    example: 12345678,
    description: '쿠팡 제품 ID',
    required: true,
  })
  productId: number;
  @ApiProperty({
    example: 1,
    description: '리뷰 페이지네이션 페이지 번호',
    required: false,
  })
  page?: number;
  @ApiProperty({
    example: 'ORDER_SCORE_ASC',
    enum: ['DATE_DESC', 'ORDER_SCORE_ASC'],
    description:
      '리뷰 정렬 방식 ("DATE_DESC": 최신순, "ORDER_SCORE_ASC": 베스트순)',
    required: false,
  })
  sortBy?: CoupangProductReviewSortBy;
  @ApiProperty({
    example: 5,
    description: '리뷰 점수 필터링 (1~5 사이 정수)',
    required: false,
  })
  rating?: number;
}
