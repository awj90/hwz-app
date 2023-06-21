import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CartItem } from '../models/cart-item';
import { CartService } from '../services/cart.service';
import { firstValueFrom, Subscription } from 'rxjs';
import { BeforeLeavingComponent } from '../utils';
import { Country } from '../models/country';
import { LocationService } from '../services/location.service';
import { State } from '../models/state';
import { CustomValidators } from '../models/custom-validators';
import { CheckoutService } from '../services/checkout.service';
import { Router } from '@angular/router';
import { Order } from '../models/order';
import { OrderItem } from '../models/order-item';
import { Customer } from '../models/customer';
import { Address } from '../models/address';
import { Purchase } from '../models/purchase';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent
  implements OnInit, OnDestroy, BeforeLeavingComponent
{
  form!: FormGroup;
  loading: boolean = true;
  cartItems: CartItem[] = [];
  totalPrice: number = 0; // excludes shipping fees if any
  totalPriceSubscription$!: Subscription;
  totalItems: number = 0;
  totalItemsSubscription$!: Subscription;
  shippingFee: number = 0;
  addressSubscription$!: Subscription;
  allMonths: number[] = [];
  remainingMonthsInCurrentYear: number[] = [];
  months: number[] = [];
  years: number[] = [];
  countries: Country[] = [];
  currentCountryCode!: string;
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];
  clientStorage: Storage = sessionStorage;

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private locationService: LocationService,
    private checkoutService: CheckoutService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // initialize dropdown fields of form (shipping and billing address's country)
    // http subscriptions are unsubscribed automatically by ng
    this.loading = true;
    firstValueFrom(this.locationService.getCountries()).then(
      (countries: Country[]) => (this.countries = countries)
    );
    this.locationService.getCurrentCountryCode().subscribe((countryCode) => {
      this.currentCountryCode = countryCode;
      this.form.get(['shippingAddress', 'country'])?.setValue(countryCode);
      this.form.get(['billingAddress', 'country'])?.setValue(countryCode);
      this.locationService.getStates(countryCode).subscribe((states) => {
        this.shippingAddressStates = states;
        this.billingAddressStates = states;
        this.loading = false;
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
    this.autopopulateFormFields();
    this.getCartDetails();
  }

  ngOnDestroy(): void {
    this.totalPriceSubscription$.unsubscribe();
    this.totalItemsSubscription$.unsubscribe();
    if (!!this.addressSubscription$) {
      this.addressSubscription$.unsubscribe();
    }
  }

  // disable and set billing address fields equal to shipping address fields if user indicates so
  onCheckOrUncheck($event: any) {
    if ($event.target.checked) {
      this.billingAddressStates = this.shippingAddressStates;
      this.form.controls['billingAddress'].setValue(
        this.form.controls['shippingAddress'].value
      );
      this.form.get('billingAddress')?.disable();
      this.addressSubscription$ = this.form.controls[
        'shippingAddress'
      ].valueChanges.subscribe((changes) => {
        this.billingAddressStates = this.shippingAddressStates;
        this.form.controls['billingAddress'].setValue(changes);
      });
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
    this.form.get([addressType, 'state'])?.reset();
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
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return; // do nothing and display all error messages if form is still invalid
    }
    const formSubmission: FormFields = this.form.value;

    const order = new Order(this.totalItems, this.totalPrice);

    const cartItems = this.cartService.cartItems;
    const orderItems = cartItems.map((cartItem) => new OrderItem(cartItem));

    const customer: Customer = new Customer(
      formSubmission['customerDetails']['firstName'],
      formSubmission['customerDetails']['lastName'],
      formSubmission['customerDetails']['email']
    );
    let shippingAddress: Address = formSubmission['shippingAddress'];
    let billingAddress: Address = !!formSubmission.billingAddress
      ? formSubmission['billingAddress']
      : shippingAddress;
    const shippingCountry = this.countries.find(
      (country) => country.code === shippingAddress.country
    );
    if (!!shippingCountry) {
      shippingAddress['country'] = shippingCountry.name;
    }
    const billingCountry = this.countries.find(
      (country) => country.code === billingAddress.country
    );
    if (!!billingCountry) {
      billingAddress['country'] = billingCountry.name;
    }

    const purchase: Purchase = new Purchase(
      customer,
      shippingAddress,
      billingAddress,
      order,
      orderItems
    );

    this.checkoutService.placeOrder(purchase).subscribe({
      next: (response) => {
        alert(
          `Your order has been received successfully.\n Order id: ${response.orderId}`
        );
        this.cartService.cartItems = [];
        this.cartService.totalItems.next(0);
        this.cartService.totalPrice.next(0);
        this.form = this.createForm();
        this.router.navigate(['/products']);
      },
      error: (error) => {
        alert(`Error: ${error.message}`);
      },
    });
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

  private autopopulateFormFields(): void {
    const customer = this.clientStorage.getItem('customer');
    if (customer) {
      const user = JSON.parse(customer);
      this.form.get(['customerDetails', 'email'])?.setValue(user.email);
      this.form.get(['customerDetails', 'firstName'])?.setValue(user.firstName);
      this.form.get(['customerDetails', 'lastName'])?.setValue(user.lastName);
      this.form.get('customerDetails')?.disable();
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      customerDetails: this.fb.group({
        firstName: new FormControl<string>('', [
          Validators.required,
          CustomValidators.whiteSpaceCheck,
        ]),
        lastName: new FormControl<string>('', [
          Validators.required,
          CustomValidators.whiteSpaceCheck,
        ]),
        email: new FormControl<string>('', [
          Validators.required,
          Validators.email,
        ]),
      }),
      shippingAddress: this.fb.group({
        country: new FormControl<string>(this.currentCountryCode, [
          Validators.required,
        ]),
        street: new FormControl<string>('', [
          Validators.required,
          CustomValidators.whiteSpaceCheck,
        ]),
        city: new FormControl<string>('', [
          Validators.required,
          CustomValidators.whiteSpaceCheck,
        ]),
        state: new FormControl<string>('', [Validators.required]),
        zipCode: new FormControl<string>('', [
          Validators.required,
          CustomValidators.whiteSpaceCheck,
        ]),
      }),
      billingAddress: this.fb.group({
        country: new FormControl<string>(this.currentCountryCode, [
          Validators.required,
        ]),
        street: new FormControl<string>('', [
          Validators.required,
          CustomValidators.whiteSpaceCheck,
        ]),
        city: new FormControl<string>('', [
          Validators.required,
          CustomValidators.whiteSpaceCheck,
        ]),
        state: new FormControl<string>('', [Validators.required]),
        zipCode: new FormControl<string>('', [
          Validators.required,
          CustomValidators.whiteSpaceCheck,
        ]),
      }),
      creditCardDetails: this.fb.group({
        cardType: new FormControl<string>('', [Validators.required]),
        nameOnCard: new FormControl<string>('', [
          Validators.required,
          CustomValidators.whiteSpaceCheck,
        ]),
        cardNumber: new FormControl<string>('', [
          Validators.required,
          Validators.pattern(/^[0-9]{16}$/), // 16 digit regex for Visa and Mastercard credit card numbers
          CustomValidators.invalidCreditCardCheck, // luhn's algorithm to validate credit card number
        ]),
        cvv: new FormControl<string>('', [
          Validators.required,
          Validators.pattern(/^[0-9]{3}$/), // 3 digit regex for Visa and Mastercard CVVs
        ]),
        expirationYear: new FormControl<number>(this.years[0], [
          Validators.required,
        ]),
        expirationMonth: new FormControl<number>(this.months[0], [
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

interface FormFields {
  customerDetails: {
    firstName: string;
    lastName: string;
    email: string;
  };
  shippingAddress: {
    country: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  billingAddress?: {
    country: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  creditCardDetails: {
    cardType: string;
    nameOnCard: string;
    cardNumber: string;
    cvv: string;
    expirationYear: number;
    expirationMonth: number;
  };
  agreeToTermsAndConditions: boolean;
  subscribeToMarketingEmails: boolean;
}
