import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CartItem } from '../models/cart-item';
import { CartService } from '../services/cart.service';
import { take, firstValueFrom, Subscription, tap } from 'rxjs';
import { BeforeLeavingComponent } from '../utils';
import { Country } from '../models/country';
import { LocationService } from '../services/location.service';
import { State } from '../models/state';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit, BeforeLeavingComponent {
  form!: FormGroup;
  loading: boolean = true;
  cartItems: CartItem[] = [];
  totalPrice: number = 0; // excludes shipping fees if any
  shippingFee: number = 0;
  addressSubscription$!: Subscription;
  allMonths: number[] = [];
  remainingMonthsInCurrentYear: number[] = [];
  months: number[] = [];
  years: number[] = [];
  countries$!: Promise<Country[]>;
  currentCountryCode!: string;
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private locationService: LocationService
  ) {}

  ngOnInit(): void {
    // initialize dropdown fields of form (shipping and billing address's country)
    // http subscriptions are unsubscribed automatically by ng
    this.countries$ = firstValueFrom(this.locationService.getCountries());
    this.locationService.getCurrentCountryCode().subscribe((countryCode) => {
      this.currentCountryCode = countryCode;
      this.form.get(['shippingAddress', 'country'])?.setValue(countryCode);
      this.form.get(['billingAddress', 'country'])?.setValue(countryCode);
      this.locationService.getStates(countryCode).subscribe((states) => {
        this.shippingAddressStates = states;
        this.billingAddressStates = states;
      });
    });

    // initialize dropdown fields of form (credit card's expiry year and month)
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
    this.months = [...this.remainingMonthsInCurrentYear]; // create a separate copy to avoid unintended mutation of original

    // initialize form group
    this.form = this.createForm();
    this.getCartDetails();
  }

  // disable and set billing address fields equal to shipping address fields if user indicates so
  onCheckOrUncheck($event: any) {
    if ($event.target.checked) {
      this.form.get('billingAddress')?.disable();
      this.form.controls['billingAddress'].setValue(
        this.form.controls['shippingAddress'].value
      );
      this.billingAddressStates = this.shippingAddressStates;
      this.addressSubscription$ = this.form.controls[
        'shippingAddress'
      ].valueChanges.subscribe((changes) =>
        this.form.controls['billingAddress'].setValue(changes)
      );
    } else {
      this.form.get('billingAddress')?.enable();
      this.form.controls['billingAddress'].reset();
      this.billingAddressStates = [];
      this.addressSubscription$.unsubscribe();
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

  getStatesForSelectedCountry(addressType: string): void {
    firstValueFrom(
      this.locationService.getStates(this.form.get(addressType)?.value.country)
    )
      .then((states) => {
        switch (addressType) {
          case 'shippingAddress':
            this.shippingAddressStates = states;
            break;
          case 'billingAddress':
            this.billingAddressStates = states;
            break;
          default:
            break;
        }
      })
      .catch((err: any) => {
        alert(err);
        console.info(err);
      });
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
        country: this.fb.control<string>(this.currentCountryCode, [
          Validators.required,
        ]),
        street: this.fb.control<string>('', [Validators.required]),
        city: this.fb.control<string>('', [Validators.required]),
        state: this.fb.control<string>('', [Validators.required]),
        postalCode: this.fb.control<string>('', [Validators.required]),
      }),
      billingAddress: this.fb.group({
        country: this.fb.control<string>(this.currentCountryCode, [
          Validators.required,
        ]),
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
