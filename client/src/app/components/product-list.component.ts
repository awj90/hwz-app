import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService } from '../services/cart.service';
import { CartItem } from '../models/cart-item';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  activeCategoryId: number = 1;
  activeSearchKey: string = '';
  loading: boolean = true;
  tableSize: number = 3;
  page: number = 1;
  count: number = 0;
  countSub$!: Subscription;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.countSub$ = this.productService.resultCount.subscribe(
      (count) => (this.count = count) // subscribe to result count of MySQL query to be used for pagination
    );
    // http and activated route subscriptions are unsubscribed automatically by ng
    this.activatedRoute.params.subscribe(() => this.getProducts());
  }

  ngOnDestroy(): void {
    this.countSub$.unsubscribe();
  }

  onPageChange($event: any) {
    this.page = $event;
    this.getProducts();
  }

  onPageSizeChange(newSize: number): void {
    this.tableSize = newSize;
    this.page = 1;
    this.getProducts();
  }

  addToCart(product: Product) {
    this.cartService.addToCart(new CartItem(product));
  }

  private getProducts() {
    this.loading = true;
    if (this.activatedRoute.snapshot.paramMap.has('keyword')) {
      this.getProductsBySearchKey();
      return;
    }
    if (this.activatedRoute.snapshot.paramMap.has('id')) {
      this.getProductsByCategory();
      return;
    }
    this.getAllProducts();
  }

  private getProductsBySearchKey() {
    const newSearchKey = this.activatedRoute.snapshot.params['keyword'];
    if (this.activeSearchKey !== newSearchKey) {
      this.activeSearchKey = newSearchKey;
      this.page = 1;
    }
    this.productService
      .getProductsBySearchKeyword(newSearchKey, this.page - 1, this.tableSize)
      .subscribe(this.subscribeHandlers());
  }

  private getProductsByCategory() {
    const activatedCategoryId = +this.activatedRoute.snapshot.params['id'];
    if (this.activeCategoryId !== activatedCategoryId) {
      this.activeCategoryId = activatedCategoryId;
      this.page = 1;
    }
    this.productService
      .getProductsByCategory(
        this.activeCategoryId,
        this.page - 1,
        this.tableSize
      )
      .subscribe(this.subscribeHandlers());
  }

  private getAllProducts() {
    this.productService
      .getAllProducts(this.page - 1, this.tableSize)
      .subscribe(this.subscribeHandlers());
  }

  private subscribeHandlers() {
    return {
      next: (data: Product[]) => {
        this.products = data;
        this.loading = false;
      },
      error: (err: any) => {
        alert(err);
        console.info(err);
        this.loading = false;
      },
    };
  }
}
