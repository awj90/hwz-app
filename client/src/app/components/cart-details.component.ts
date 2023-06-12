import { Component, OnInit } from '@angular/core';
import { CartItem } from '../models/cart-item';
import { CartService } from '../services/cart.service';
import { firstValueFrom, take } from 'rxjs';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css'],
})
export class CartDetailsComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  totalItems: number = 0;
  shippingFee: number = 0;
  loading: boolean = true;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.getCartDetails();
  }

  private getCartDetails() {
    this.loading = true;
    this.cartItems = this.cartService.cartItems.slice(); // get a copy without modifying
    // using take 1 to allow Angular to manage the unsubscription
    this.cartService.totalPrice.pipe(take(1)).subscribe({
      next: (totalPrice: number) => {
        this.totalPrice = totalPrice;
        this.loading = false;
      },
      error: (err: any) => {
        alert(err);
        console.info(err);
        this.loading = false;
      },
    });
    // using take 1 to allow Angular to manage the unsubscription
    this.cartService.totalItems.pipe(take(1)).subscribe({
      next: (totalItems: number) => {
        this.totalItems = totalItems;
        this.loading = false;
      },
      error: (err: any) => {
        alert(err);
        console.info(err);
        this.loading = false;
      },
    });
    this.cartService.computeCartTotals(); // trigger an emission for take 1 to get
  }
}
