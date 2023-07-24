import axios from 'axios';
import * as cheerio from 'cheerio';
import { Injectable } from '@nestjs/common';
import { CoupangProductSorter, GetKeywordInfoDTO, GetProductsDTO } from './dto';

const COUPANG_SEARCH_URL = 'https://www.coupang.com/np/search';

@Injectable()
export class CoupangCrawlingService {
  getIsEmptySearchPage($: cheerio.CheerioAPI): boolean {
    return !!$('.search-empty-content').html();
  }

  async getKeywordInfo(keywords: string): Promise<GetKeywordInfoDTO> {
    const coupangSearchPageRawText = await axios
      .get(COUPANG_SEARCH_URL, {
        params: {
          q: keywords,
          listSize: 72,
        },
      })
      .then((res) => {
        return res.data;
      });
    const $coupang = cheerio.load(coupangSearchPageRawText);
    const isEmpty = this.getIsEmptySearchPage($coupang);
    let pageCount = 0;
    if (!isEmpty) {
      pageCount = $coupang('.search-pagination .btn-page a').length;
    }

    return {
      isEmpty,
      pageCount,
      keywords,
    };
  }

  async getProducts(
    keywords: string,
    page: number,
    sorter: CoupangProductSorter = 'scoreDesc',
  ): Promise<GetProductsDTO[]> {
    const coupangSearchPageRawText = await axios
      .get(COUPANG_SEARCH_URL, {
        params: {
          q: keywords,
          page,
          sorter,
          listSize: 72,
        },
      })
      .then((res) => res.data);
    const $coupang = cheerio.load(coupangSearchPageRawText);
    const isEmpty = this.getIsEmptySearchPage($coupang);

    if (isEmpty) {
      return [];
    }

    const productListTags = $coupang('li.search-product');

    return productListTags
      .map((_, productListTag) => {
        const $productListTag = $coupang(productListTag);
        const id = $productListTag.attr('id');
        const name = $productListTag
          .find('.search-product-wrap .descriptions .name')
          .text();
        const price =
          Number(
            $productListTag
              .find('.search-product-wrap .price-value')
              .text()
              .replace(/,/g, ''),
          ) || 0;
        const originalPrice =
          Number(
            $productListTag
              .find('.search-product-wrap .base-price')
              .text()
              .replace(/,/g, ''),
          ) || price;
        const dcRate =
          Number(
            $productListTag
              .find('.search-product-wrap .instant-discount-rate')
              .text()
              .replace('%', ''),
          ) || 0;
        const thumbnail = $productListTag
          .find('.search-product-wrap .search-product-wrap-img')
          .attr('src');
        const rating =
          Number($productListTag.find('.search-product-wrap .rating').text()) ||
          0;
        const reviewCount =
          Number(
            $productListTag
              .find('.search-product-wrap .rating-total-count')
              .text()
              .replace(/[\(\)]/g, ''),
          ) || 0;
        const isSoldOut = !!$productListTag
          .find('.search-product-wrap .out-of-stock')
          .text();
        const url = `https://www.coupang.com/vp/products/${id}`;

        return {
          id,
          name,
          price,
          originalPrice,
          dcRate,
          thumbnail,
          rating,
          reviewCount,
          isSoldOut,
          url,
        };
      })
      .toArray();
  }
}
