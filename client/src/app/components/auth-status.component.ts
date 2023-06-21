import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { OKTA_AUTH, OktaAuthStateService } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { Subscription } from 'rxjs';
import { Customer } from '../models/customer';

@Component({
  selector: 'app-auth-status',
  templateUrl: './auth-status.component.html',
  styleUrls: ['./auth-status.component.css'],
})
export class AuthStatusComponent implements OnInit, OnDestroy {
  isAuthenticated: boolean = false;
  username!: string;
  hour: number = new Date().getHours() + 1;
  authState$!: Subscription;
  clientStorage: Storage = sessionStorage;

  constructor(
    @Inject(OKTA_AUTH) private oktaAuth: OktaAuth,
    private oktaAuthStateService: OktaAuthStateService
  ) {}

  ngOnInit(): void {
    this.authState$ = this.oktaAuthStateService.authState$.subscribe(
      (authState) => {
        this.isAuthenticated = !!authState.isAuthenticated;
        if (this.isAuthenticated) {
          this.oktaAuth.getUser().then((userClaims) => {
            this.username = userClaims.given_name as string;
            const lastName: string = userClaims.family_name as string;
            const email: string = userClaims.email as string;
            this.clientStorage.setItem(
              'customer',
              JSON.stringify(new Customer(this.username, lastName, email))
            );
          });
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.authState$.unsubscribe();
  }

  logout() {
    // clear session storage and sign out
    this.clientStorage.removeItem('customer');
    this.oktaAuth.signOut();
  }
}
