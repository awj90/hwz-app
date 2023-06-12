import { Component, OnDestroy, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart-status',
  templateUrl: './cart-status.component.html',
  styleUrls: ['./cart-status.component.css'],
})
export class CartStatusComponent implements OnInit, OnDestroy {
  constructor(private cartService: CartService) {}

  totalPrice: number = 0;
  totalItems: number = 0;
  totalPriceSub$!: Subscription;
  totalItemsSub$!: Subscription;

  ngOnInit(): void {
    this.totalPriceSub$ = this.cartService.totalPrice.subscribe(
      (totalPrice) => (this.totalPrice = totalPrice)
    );
    this.totalItemsSub$ = this.cartService.totalItems.subscribe(
      (totalItems) => (this.totalItems = totalItems)
    );
  }

  ngOnDestroy(): void {
    this.totalPriceSub$.unsubscribe();
    this.totalItemsSub$.unsubscribe();
  }
}
