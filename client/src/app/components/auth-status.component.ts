import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { OKTA_AUTH, OktaAuthStateService } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { Subscription } from 'rxjs';

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
          });
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.authState$.unsubscribe();
  }

  logout() {
    this.oktaAuth.signOut();
  }
}
