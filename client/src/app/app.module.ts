import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

import {
  OktaAuthGuard,
  OktaAuthModule,
  OktaCallbackComponent,
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

import { ProductService } from './services/product.service';
import { CartService } from './services/cart.service';
import { LocationService } from './services/location.service';
import { CheckoutService } from './services/checkout.service';
import { OrdersService } from './services/orders.service';

import { formGuard, authGuard } from './utils';

import AppConfig from './config/app-config';

const oktaConfig = AppConfig['oidc'];
const oktaAuth = new OktaAuth(oktaConfig);
const moduleConfig: OktaConfig = { oktaAuth };

const appRoutes: Routes = [
  {
    path: 'order-history',
    component: OrdersHistoryComponent,
    canActivate: [OktaAuthGuard],
    data: { onAuthRequired: authGuard },
  },
  {
    path: 'protected',
    component: ProtectedComponent,
    canActivate: [OktaAuthGuard],
    data: { onAuthRequired: authGuard },
  },
  { path: 'login/callback', component: OktaCallbackComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'checkout',
    component: CheckoutComponent,
    canDeactivate: [formGuard],
  },
  { path: 'cart', component: CartDetailsComponent },
  { path: 'products/:id', component: ProductComponent },
  { path: 'search/:keyword', component: ProductListComponent },
  {
    path: 'category/:id',
    component: ProductListComponent,
  },
  {
    path: 'category',
    component: ProductListComponent,
  },
  {
    path: 'products',
    component: ProductListComponent,
  },
  { path: '', redirectTo: '/products', pathMatch: 'full' },
  { path: '**', redirectTo: '/products', pathMatch: 'full' },
];

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
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    OktaAuthModule.forRoot(moduleConfig),
    RouterModule.forRoot(appRoutes),
  ],
  providers: [
    ProductService,
    CartService,
    LocationService,
    CheckoutService,
    OrdersService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
