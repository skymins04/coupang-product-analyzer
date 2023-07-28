import axios from 'axios';
import * as cheerio from 'cheerio';
import { Injectable } from '@nestjs/common';
import { CoupangProductSorter, GetKeywordInfoDTO, GetProductsDTO } from './dto';
import {
  CoupangProductReviewSortBy,
  GetProductReviewDTO,
} from './dto/get-product-review.dto';

const COUPANG_SEARCH_BASE_URL = 'https://www.coupang.com/np/search';
const COUPANG_REVIEW_BASE_URL = 'https://www.coupang.com/vp/product/reviews';
const COUPANG_PRODUCT_BASE_URL = 'https://www.coupang.com/vp/products';

@Injectable()
export class CoupangCrawlingService {
  getIsEmptySearchPage($: cheerio.CheerioAPI): boolean {
    return !!$('.search-empty-content').html();
  }

  async getKeywordInfo(keywords: string): Promise<GetKeywordInfoDTO> {
    const coupangSearchPageRawText = await axios
      .get(COUPANG_SEARCH_BASE_URL, {
        params: {
          q: keywords,
          listSize: 72,
        },
        headers: {
          Cookie: '',
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
      .get(COUPANG_SEARCH_BASE_URL, {
        params: {
          q: keywords,
          page,
          sorter,
          listSize: 72,
        },
        headers: {
          Cookie: '',
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

  async getProductReviews(
    productId: number,
    options: {
      page?: number;
      sortBy?: CoupangProductReviewSortBy;
      rating?: number;
    },
  ): Promise<GetProductReviewDTO[]> {
    const { page = 1, sortBy = 'ORDER_SCORE_ASC', rating } = options;
    const ceiledPage = Math.ceil(page);
    const filteredPage = ceiledPage < 1 ? 1 : ceiledPage;
    const filteredRating =
      rating === undefined ? '' : rating < 1 ? 1 : rating > 5 ? 5 : rating;

    const coupangProductReviewPageRawText = await axios
      .get(COUPANG_REVIEW_BASE_URL, {
        params: {
          productId,
          page: filteredPage,
          size: 30,
          sortBy,
          ratings: filteredRating,
          viRoleCode: 3,
          ratingSummary: true,
        },
        headers: {
          Cookie: 'x-coupang-accept-language=ko-KR;',
          Referer: `${COUPANG_PRODUCT_BASE_URL}/${productId}`,
        },
      })
      .then((res) => {
        console.log(res.request);
        return res.data;
      });

    const $coupang = cheerio.load(coupangProductReviewPageRawText);

    const reviewArticleTags = $coupang('.sdp-review__article__list');
    return reviewArticleTags
      .map((_, reviewArticleTag) => {
        const $reviewArticleTag = $coupang(reviewArticleTag);
        const createdAt = $reviewArticleTag
          .find('.sdp-review__article__list__info__product-info__reg-date')
          .text();
        const attachmentURLs = $reviewArticleTag
          .find('.sdp-review__article__list__attachment__list')
          .map((_, attachment) => attachment.attribs.src as string)
          .toArray();
        const rating = Number(
          $reviewArticleTag
            .find('.sdp-review__article__list__info__product-info__star-orange')
            .attr('data-rating'),
        );
        const comment = $reviewArticleTag
          .find('.sdp-review__article__list__review__content')
          .html();

        return {
          createdAt,
          attachmentURLs,
          rating,
          comment,
        };
      })
      .toArray();
  }
}
