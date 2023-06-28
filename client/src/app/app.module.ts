import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

import {
  OktaAuthModule,
  OktaConfig,
} from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';

import { AppComponent } from './app.component';
import { ProductListComponent } from './components/product-list.component';
import { SideBarComponent } from './components/side-bar.component';
import { SearchComponent } from './components/search.component';
import { ProductComponent } from './components/product.component';
import { CartStatusComponent } from './components/cart-status.component';
import { CartDetailsComponent } from './components/cart-details.component';
import { CheckoutComponent } from './components/checkout.component';
import { LoginComponent } from './components/login.component';
import { AuthStatusComponent } from './components/auth-status.component';
import { ProtectedComponent } from './components/protected.component';
import { OrdersHistoryComponent } from './components/orders-history.component';
import { ModalComponent } from './components/modal.component';

import { ProductService } from './services/product.service';
import { CartService } from './services/cart.service';
import { LocationService } from './services/location.service';
import { CheckoutService } from './services/checkout.service';
import { OrdersService } from './services/orders.service';
import { AuthInterceptorService } from './services/auth-interceptor.service';

import AppConfig from './config/app-config';
import { AppRoutingModule } from './app-routing.module';
import { WebcamComponent } from './components/webcam.component';

const oktaConfig = AppConfig['oidc'];
const oktaAuth = new OktaAuth(oktaConfig);
const moduleConfig: OktaConfig = { oktaAuth };

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    SideBarComponent,
    SearchComponent,
    ProductComponent,
    CartStatusComponent,
    CartDetailsComponent,
    CheckoutComponent,
    LoginComponent,
    AuthStatusComponent,
    ProtectedComponent,
    OrdersHistoryComponent,
    ModalComponent,
    WebcamComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    AppRoutingModule,
    OktaAuthModule.forRoot(moduleConfig),
  ],
  providers: [
    ProductService,
    CartService,
    LocationService,
    CheckoutService,
    OrdersService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
