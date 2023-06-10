import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, Output } from '@angular/core';
import { Observable, Subject, map, tap } from 'rxjs';
import { Product } from '../models/product';
import { ProductCategory } from '../models/product-category';

@Injectable()
export class ProductService {
  private BASE_API_URL_ENDPOINT: string = 'http://localhost:8080/api';

  @Output()
  resultCount = new Subject<number>();

  constructor(private http: HttpClient) {}

  getAllProducts(page: number = 0, size: number = 20): Observable<Product[]> {
    const FULL_API_URL_ENDPOINT = `${this.BASE_API_URL_ENDPOINT}/products`;

    return this.http
      .get<ApiGetResponseForProducts>(FULL_API_URL_ENDPOINT, {
        params: new HttpParams().set('page', page).set('size', size),
      })
      .pipe(
        tap((resp) => this.resultCount.next(resp.page['totalElements'])),
        map((resp) => resp._embedded.products)
      );
  }

  getProductsByCategory(
    categoryId: number = 1,
    page: number = 0,
    size: number = 20
  ): Observable<Product[]> {
    const FULL_API_URL_ENDPOINT = `${this.BASE_API_URL_ENDPOINT}/products/search/findByCategoryId?`;

    return this.http
      .get<ApiGetResponseForProducts>(FULL_API_URL_ENDPOINT, {
        params: new HttpParams()
          .set('id', categoryId)
          .set('page', page)
          .set('size', size),
      })
      .pipe(
        tap((resp) => this.resultCount.next(resp.page['totalElements'])),
        map((resp) => resp._embedded.products)
      );
  }

  getProductsBySearchKeyword(
    searchKeyword: string,
    page: number = 0,
    size: number = 20
  ): Observable<Product[]> {
    const FULL_API_URL_ENDPOINT = `${this.BASE_API_URL_ENDPOINT}/products/search/findByNameContainingOrDescriptionContaining`;

    return this.http
      .get<ApiGetResponseForProducts>(FULL_API_URL_ENDPOINT, {
        params: new HttpParams()
          .set('name', searchKeyword)
          .set('description', searchKeyword)
          .set('page', page)
          .set('size', size),
      })
      .pipe(
        tap((resp) => this.resultCount.next(resp.page['totalElements'])),
        map((resp) => resp._embedded.products)
      );
  }

  getProductCategories(): Observable<ProductCategory[]> {
    const FULL_API_URL_ENDPOINT = `${this.BASE_API_URL_ENDPOINT}/product-category`;
    return this.http
      .get<ApiGetResponseForProductCategories>(FULL_API_URL_ENDPOINT)
      .pipe(map((resp) => resp._embedded.productCategory));
  }

  getProductById(id: number): Observable<Product> {
    const FULL_API_URL_ENDPOINT = `${this.BASE_API_URL_ENDPOINT}/products/${id}`;
    return this.http.get<Product>(FULL_API_URL_ENDPOINT);
  }
}

interface ApiGetResponseForProducts {
  _embedded: {
    products: Product[];
  };
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}

interface ApiGetResponseForProductCategories {
  _embedded: {
    productCategory: ProductCategory[];
  };
}
