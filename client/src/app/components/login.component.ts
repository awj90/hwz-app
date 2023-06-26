import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import AppConfig from '../config/app-config';
import { OktaAuth } from '@okta/okta-auth-js';
import { OKTA_AUTH } from '@okta/okta-angular';
import OktaSignIn from '@okta/okta-signin-widget';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  oktaSignIn: any;

  constructor(@Inject(OKTA_AUTH) public oktaAuth: OktaAuth) {
    this.oktaSignIn = new OktaSignIn({
      logo: 'assets/images/logo.png',
      features: {
        registration: true,
      },
      baseUrl: AppConfig.oidc.issuer.split('/oauth2')[0],
      clientId: AppConfig.oidc.clientId,
      redirectUri: AppConfig.oidc.redirectUri,
      authParams: {
        pkce: true,
        issuer: AppConfig.oidc.issuer,
        scopes: AppConfig.oidc.scopes,
      },
      idps: [{ type: 'google', id: '0oaa4ln3j3jNcmCFR5d7' }],
    });
  }

  ngOnInit(): void {
    // this.oktaSignIn.remove();
    this.oktaSignIn.renderEl(
      {
        el: '#okta-log-in-widget',
      },
      (response: any) => {
        if (response.status === 'SUCCESS') {
          this.oktaAuth.signInWithRedirect();
        }
      },
      (error: any) => {
        throw error;
      }
    );
  }

  ngOnDestroy(): void {
    this.oktaSignIn.remove();
  }
}
