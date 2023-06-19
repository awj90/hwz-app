import { Component, OnDestroy, OnInit } from '@angular/core';
import { CartItem } from '../models/cart-item';
import { CartService } from '../services/cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css'],
})
export class CartDetailsComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  totalItems: number = 0;
  totalPriceSubscription$!: Subscription;
  totalItemsSubscription$!: Subscription;
  shippingFee: number = 0;
  loading: boolean = true;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.getCartDetails();
  }

  ngOnDestroy(): void {
    this.totalPriceSubscription$.unsubscribe();
    this.totalItemsSubscription$.unsubscribe();
  }

  private getCartDetails() {
    this.loading = true;
    this.cartItems = this.cartService.cartItems.slice(); // get a copy without modifying
    this.shippingFee = this.cartService.shippingFee;
    this.totalPriceSubscription$ = this.cartService.totalPrice.subscribe({
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
    this.totalItemsSubscription$ = this.cartService.totalItems.subscribe({
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
  }

  incrementQuantity(cartItem: CartItem) {
    this.cartService.addToCart(cartItem);
    this.getCartDetails();
  }

  decrementQuantity(cartItem: CartItem) {
    this.cartService.removeOneFromCart(cartItem);
    this.getCartDetails();
  }

  removeFromCart(cartItem: CartItem) {
    this.cartService.removeFromCart(cartItem);
    this.getCartDetails();
  }
}
