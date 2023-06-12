import { Injectable, Output } from '@angular/core';
import { CartItem } from '../models/cart-item';
import { Subject } from 'rxjs';

@Injectable()
export class CartService {
  cartItems: CartItem[] = [];
  totalPrice = new Subject<number>();
  totalItems = new Subject<number>();

  addToCart(cartItem: CartItem) {
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

  computeCartTotals() {
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
