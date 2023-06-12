import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';

import { AppComponent } from './app.component';
import { ProductListComponent } from './components/product-list.component';
import { ProductService } from './services/product.service';
import { SideBarComponent } from './components/side-bar.component';
import { SearchComponent } from './components/search.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductComponent } from './components/product.component';
import { CartStatusComponent } from './components/cart-status.component';
import { CartService } from './services/cart.service';
import { CartDetailsComponent } from './components/cart-details.component';
import { CheckoutComponent } from './components/checkout.component';
import { formGuard } from './utils';

const appRoutes: Routes = [
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
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    RouterModule.forRoot(appRoutes),
  ],
  providers: [ProductService, CartService],
  bootstrap: [AppComponent],
})
export class AppModule {}
