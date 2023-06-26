import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Purchase } from '../models/purchase';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Payment } from '../models/payment';

@Injectable()
export class CheckoutService {
  SPRINGBOOT_BASE_API_URL_ENDPOINT: string = environment['serverApiUrl'];

  constructor(private http: HttpClient) {}

  placeOrder(purchase: Purchase): Observable<any> {
    const PURCHASE_API_URL_ENDPOINT: string = `${this.SPRINGBOOT_BASE_API_URL_ENDPOINT}/checkout/purchase`;
    return this.http.post<Purchase>(PURCHASE_API_URL_ENDPOINT, purchase);
  }

  createPaymentIntent(payment: Payment): Observable<any> {
    const PAYMENT_API_URL_ENDPOINT: string = `${this.SPRINGBOOT_BASE_API_URL_ENDPOINT}/checkout/payment-intent`;
    return this.http.post<Payment>(PAYMENT_API_URL_ENDPOINT, payment);
  }
}
