import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, map, tap } from 'rxjs';
import { OrdersHistory } from '../models/orders-history';
import { environment } from 'src/environments/environment.development';

@Injectable()
export class OrdersService {
  SPRINGBOOT_BASE_API_URL_ENDPOINT: string = environment['serverApiUrl'];

  constructor(private http: HttpClient) {}

  resultCount = new Subject<number>();

  // GET /api/orders/search/findByCustomerEmailOrderByDateCreatedDesc?email=fred@gmail.com&page=0&size=20
  // select * from orders join customer on orders.customer_id = customer.id where customer.email='fred@gmail.com' order by orders.date_created desc limit 20 offset 0;
  // @RequestParam String email, @RequestParam(defaultValue = 0) int page, @RequestParam(defaultValue = 20) int size
  // offset (page) and limit (size) are optional, defaults are 0 and 20 respectively
  getOrdersHistory(
    email: string,
    page: number = 0,
    size: number = 20
  ): Observable<OrdersHistory[]> {
    const FULL_API_URL_ENDPOINT = `${this.SPRINGBOOT_BASE_API_URL_ENDPOINT}/orders/search/findByCustomerEmailOrderByDateCreatedDesc`;

    return this.http
      .get<ApiGetResponseForOrdersHistory>(FULL_API_URL_ENDPOINT, {
        params: new HttpParams()
          .set('email', email)
          .set('page', page)
          .set('size', size),
      })
      .pipe(
        tap((resp) => this.resultCount.next(resp.page['totalElements'])),
        map((resp) => resp._embedded.orders)
      );
  }
}

// JSON format of the server response
interface ApiGetResponseForOrdersHistory {
  _embedded: {
    orders: OrdersHistory[];
  };
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}
