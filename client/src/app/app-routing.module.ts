import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { OktaAuthGuard, OktaCallbackComponent } from '@okta/okta-angular';
import { CartDetailsComponent } from './components/cart-details.component';
import { CheckoutComponent } from './components/checkout.component';
import { LoginComponent } from './components/login.component';
import { OrdersHistoryComponent } from './components/orders-history.component';
import { ProductListComponent } from './components/product-list.component';
import { ProductComponent } from './components/product.component';
import { ProtectedComponent } from './components/protected.component';
import { authGuard, formGuard } from './utils';

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
  imports: [
    RouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
