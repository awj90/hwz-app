import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Purchase } from '../models/purchase';
import { Observable } from 'rxjs';

@Injectable()
export class CheckoutService {
  private SPRINGBOOT_BASE_API_URL_ENDPOINT: string =
    'http://localhost:8080/api/checkout/purchase';

  constructor(private http: HttpClient) {}

  placeOrder(purchase: Purchase): Observable<any> {
    return this.http.post<Purchase>(
      this.SPRINGBOOT_BASE_API_URL_ENDPOINT,
      purchase
    );
  }
}
