import { ApiProperty } from '@nestjs/swagger';

export class GetKeywordInfoDTO {
  @ApiProperty({
    example: false,
    description: '키워드 검색 결과가 비어있는 여부',
  })
  isEmpty: boolean;
  @ApiProperty({
    example: 3,
    description: '키워드 검색 결과의 전체 페이지 개수',
  })
  pageCount: number;
  @ApiProperty({
    example: '신형 스마트 워터탭',
    description: '검색 키워드',
  })
  keywords: string;
}

export class GetKeywordInfoRequestDTO {
  @ApiProperty({
    example: '신형 스마트 워터탭',
    description: '검색 키워드',
    required: true,
  })
  keywords: string;
}
