import { Component, OnDestroy, OnInit } from '@angular/core';
import { OrdersHistory } from '../models/orders-history';
import { OrdersService } from '../services/orders.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-orders-history',
  templateUrl: './orders-history.component.html',
  styleUrls: ['./orders-history.component.css'],
})
export class OrdersHistoryComponent implements OnInit, OnDestroy {
  loading: boolean = true;
  pastOrders: OrdersHistory[] = [];
  usersEmail!: string;
  count: number = 0;
  countArray: number[] = [];
  countSub$!: Subscription;
  clientStorage: Storage = sessionStorage;

  constructor(private ordersService: OrdersService) {}

  ngOnInit(): void {
    this.loading = true;
    const customer = this.clientStorage.getItem('customer');
    this.usersEmail = customer ? JSON.parse(customer)['email'] : '';
    this.getOrdersHistory(this.usersEmail);
    this.countSub$ = this.ordersService.resultCount.subscribe((count) => {
      this.countArray = [];
      this.count = count;
      for (let i = 1; i <= count; i++) {
        this.countArray.push(i);
      }
    });
  }

  ngOnDestroy(): void {
    this.countSub$.unsubscribe();
  }

  onLimitChange(limit: number): void {
    this.loading = true;
    this.pastOrders = [];
    this.getOrdersHistory(this.usersEmail, 0, limit);
  }

  private getOrdersHistory(
    email: string,
    page: number = 0,
    size: number = 20
  ): void {
    // http observables are automatically unsuscribed by angular
    this.loading = true;
    this.ordersService.getOrdersHistory(email, page, size).subscribe({
      next: (data: OrdersHistory[]) => {
        this.pastOrders = data;
        this.loading = false;
      },
      error: (err: any) => {
        alert(err);
        console.info(err);
        this.loading = false;
      },
    });
  }
}
