import { Component, OnInit } from '@angular/core';
import { Product } from '../models/product';
import { ProductService } from '../services/product.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit {
  product!: Product;
  loading: boolean = true;

  constructor(
    private productService: ProductService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // http and activated route subscriptions are unsubscribed automatically by ng
    this.activatedRoute.params.subscribe(() => this.getProduct());
  }

  private getProduct() {
    this.loading = true;
    const productId: number = +this.activatedRoute.snapshot.params['id'];
    this.productService.getProductById(productId).subscribe({
      next: (data) => {
        this.product = data;
        this.loading = false;
      },
      error: (err) => {
        alert(err);
        console.info(err);
        this.loading = false;
      },
    });
  }
}
