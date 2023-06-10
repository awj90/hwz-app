import { Component, OnInit } from '@angular/core';
import { ProductCategory } from '../models/product-category';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css'],
})
export class SideBarComponent implements OnInit {
  productCategories: ProductCategory[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    // http and activated route subscriptions are unsubscribed automatically by ng
    this.getProductCategories();
  }

  getProductCategories() {
    this.productService.getProductCategories().subscribe({
      next: (data) => (this.productCategories = data),
      error: (err) => {
        alert(err);
        console.info(err);
      },
    });
  }
}
