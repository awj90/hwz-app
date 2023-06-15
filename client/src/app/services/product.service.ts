import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, map, tap } from 'rxjs';
import { Product } from '../models/product';
import { ProductCategory } from '../models/product-category';

@Injectable()
export class ProductService {
  private SPRINGBOOT_BASE_API_URL_ENDPOINT: string = 'http://localhost:8080/api';

  // emit the result count of a MySQL query for pagination purposes (subscribed in ProductListComponent)
  resultCount = new Subject<number>();

  constructor(private http: HttpClient) {}

  getAllProducts(page: number = 0, size: number = 20): Observable<Product[]> {
    const FULL_API_URL_ENDPOINT = `${this.SPRINGBOOT_BASE_API_URL_ENDPOINT}/products`;

    return this.http
      .get<ApiGetResponseForProducts>(FULL_API_URL_ENDPOINT, {
        params: new HttpParams().set('page', page).set('size', size),
      })
      .pipe(
        tap((resp) => this.resultCount.next(resp.page['totalElements'])),
        map((resp) => resp._embedded.products)
      );
  }

  // GET /api/products/search/findByCategoryId?id=1&page=0&size=20
  // select * from product where category_id = 1 offset 0 limit 20;
  // @RequestParam Long id, @RequestParam(defaultValue = 0) int page, @RequestParam(defaultValue = 20) int size
  // offset (page) and limit (size) are optional, defaults are 0 and 20 respectively
  getProductsByCategory(
    categoryId: number = 1,
    page: number = 0,
    size: number = 20
  ): Observable<Product[]> {
    const FULL_API_URL_ENDPOINT = `${this.SPRINGBOOT_BASE_API_URL_ENDPOINT}/products/search/findByCategoryId?`;

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

  // GET /api/products/search/findByNameContainingOrDescriptionContaining?name=fred&description=fred&page=0&size=20
  // select * from product where name like '%fred%' or description like '%fred%' offset 0 limit 20;
  // @RequestParam String name, @RequestParam String description, @RequestParam(defaultValue = 0) int page, @RequestParam(defaultValue = 20) int size
  // offset (page) and limit (size) are optional, defaults are 0 and 20 respectively
  getProductsBySearchKeyword(
    searchKeyword: string,
    page: number = 0,
    size: number = 20
  ): Observable<Product[]> {
    const FULL_API_URL_ENDPOINT = `${this.SPRINGBOOT_BASE_API_URL_ENDPOINT}/products/search/findByNameContainingOrDescriptionContaining`;

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
    const FULL_API_URL_ENDPOINT = `${this.SPRINGBOOT_BASE_API_URL_ENDPOINT}/product-category`;
    return this.http
      .get<ApiGetResponseForProductCategories>(FULL_API_URL_ENDPOINT)
      .pipe(map((resp) => resp._embedded.productCategory));
  }

  // GET /api/products/1
  // select * from product where id = 1
  // @PathVariable Long id
  getProductById(id: number): Observable<Product> {
    const FULL_API_URL_ENDPOINT = `${this.SPRINGBOOT_BASE_API_URL_ENDPOINT}/products/${id}`;
    return this.http.get<Product>(FULL_API_URL_ENDPOINT);
  }
}

// JSON format of the server response
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

// JSON format of the server response
interface ApiGetResponseForProductCategories {
  _embedded: {
    productCategory: ProductCategory[];
  };
}
