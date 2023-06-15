import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CartItem } from '../models/cart-item';
import { CartService } from '../services/cart.service';
import { take } from 'rxjs';
import { BeforeLeavingComponent } from '../utils';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit, BeforeLeavingComponent {
  form!: FormGroup;
  cartItems: CartItem[] = [];
  totalPrice: number = 0; // excludes shipping fees if any
  shippingFee: number = 0;
  loading: boolean = true;
  allMonths: number[] = [];
  remainingMonthsInCurrentYear: number[] = [];
  months: number[] = [];
  years: number[] = [];

  constructor(private fb: FormBuilder, private cartService: CartService) {
    for (
      let i = new Date().getFullYear();
      i <= new Date().getFullYear() + 6;
      i++
    ) {
      this.years.push(i);
    }
    for (let i = 1; i <= 12; i++) {
      this.allMonths.push(i);
    }
    for (let i = new Date().getMonth() + 1; i <= 12; i++) {
      this.remainingMonthsInCurrentYear.push(i);
    }
    this.months = [...this.remainingMonthsInCurrentYear]; // create a separate copy
  }

  ngOnInit(): void {
    this.form = this.createForm();
    this.getCartDetails();
  }

  // set billing address fields equal to shipping address fields if user indicates so
  onCheckOrUncheck($event: any) {
    if ($event.target.checked) {
      this.form.controls['billingAddress'].setValue(
        this.form.controls['shippingAddress'].value
      );
    } else {
      this.form.controls['billingAddress'].reset();
    }
  }

  // if user's credit card expires in the current year year, only the remaining months in the current year should be shown
  updateAvailableMonths($event: any): void {
    if (+$event.target.value === new Date().getFullYear()) {
      this.months = this.remainingMonthsInCurrentYear;
    } else {
      this.months = this.allMonths;
    }
  }

  formSubmissionHandler() {
    console.info(this.form.value);
    this.form.reset();
  }

  formNotSaved(): boolean {
    return this.form.dirty;
  }

  confirmMessage(): string {
    return 'You have not completed making the purchase.\n Are you sure you want to leave?';
  }

  private getCartDetails() {
    this.loading = true;
    this.cartItems = this.cartService.cartItems.slice(); // just get a copy without modifying
    this.shippingFee = this.cartService.shippingFee;
    // using take 1 here to allow Angular to manage the unsubscription
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
    this.cartService.computeCartTotals(); // trigger an emission for take 1 to get
  }

  private createForm(): FormGroup {
    return this.fb.group({
      customerDetails: this.fb.group({
        firstName: this.fb.control<string>('', [Validators.required]),
        lastName: this.fb.control<string>('', [Validators.required]),
        email: this.fb.control<string>('', [
          Validators.required,
          Validators.email,
        ]),
      }),
      shippingAddress: this.fb.group({
        country: this.fb.control<string>('', [Validators.required]),
        street: this.fb.control<string>('', [Validators.required]),
        city: this.fb.control<string>('', [Validators.required]),
        state: this.fb.control<string>('', [Validators.required]),
        postalCode: this.fb.control<string>('', [Validators.required]),
      }),
      billingAddress: this.fb.group({
        country: this.fb.control<string>('', [Validators.required]),
        street: this.fb.control<string>('', [Validators.required]),
        city: this.fb.control<string>('', [Validators.required]),
        state: this.fb.control<string>('', [Validators.required]),
        postalCode: this.fb.control<string>('', [Validators.required]),
      }),
      creditCardDetails: this.fb.group({
        cardType: this.fb.control<string>('', [Validators.required]),
        nameOnCard: this.fb.control<string>('', [Validators.required]),
        cardNumber: this.fb.control<string>('', [
          Validators.required,
          Validators.pattern(/^[0-9]{16}$/), // 16 digit regex for Visa and Mastercard credit card numbers
        ]),
        cvv: this.fb.control<string>('', [
          Validators.required,
          Validators.pattern(/^[0-9]{3}$/), // 3 digit regex for Visa and Mastercard CVVs
        ]),
        expirationYear: this.fb.control<number>(this.years[0], [
          Validators.required,
        ]),
        expirationMonth: this.fb.control<number>(this.months[0], [
          Validators.required,
        ]),
      }),
      agreeToTermsAndConditions: this.fb.control<boolean>(true, [
        Validators.requiredTrue, // required True
      ]),
      subscribeToMarketingEmails: this.fb.control<boolean>(true),
    });
  }
}
