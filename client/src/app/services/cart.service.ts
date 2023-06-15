import { Injectable } from '@angular/core';
import { CartItem } from '../models/cart-item';
import { Subject } from 'rxjs';

@Injectable()
export class CartService {
  cartItems: CartItem[] = [];
  shippingFee: number = 0;
  totalPrice = new Subject<number>();
  totalItems = new Subject<number>();

  addToCart(cartItem: CartItem): void {
    const index = this.cartItems.findIndex((item) => item.id === cartItem.id);

    if (index === -1) {
      // item does not exist in cart, add item to cart
      this.cartItems.push(cartItem);
    } else {
      // item exists in cart, increment item's quantity by one
      this.cartItems[index].quantity++;
    }
    this.computeCartTotals();
  }

  removeOneFromCart(cartItem: CartItem): void {
    const index = this.cartItems.findIndex((item) => item.id === cartItem.id);
    if (index === -1) {
      return; // do nothing if item does not exist in cart
    }
    if (this.cartItems[index].quantity > 1) {
      this.cartItems[index].quantity--; // decrement quantity by 1
    } else {
      this.cartItems.splice(index, 1); // completely remove from cart if quantity reached 0
    }
  }

  removeFromCart(cartItem: CartItem): void {
    const index = this.cartItems.findIndex((item) => item.id === cartItem.id);
    if (index === -1) {
      return; // do nothing if item does not exist in cart
    }
    this.cartItems.splice(index, 1); // completely remove from cart
  }

  // emits the total price and total item to subscribers in the CartDetails, CartStatus, Checkout components
  computeCartTotals(): void {
    let totalPrice: number = 0;
    let totalItems: number = 0;
    for (let cartItem of this.cartItems) {
      totalPrice += cartItem.quantity * cartItem.unitPrice;
      totalItems += cartItem.quantity;
    }
    this.totalPrice.next(totalPrice);
    this.totalItems.next(totalItems);
  }
}
