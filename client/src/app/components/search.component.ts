import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, Subscription, debounceTime, filter, map, tap } from 'rxjs';
import { Product } from '../models/product';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private productService: ProductService
  ) {}

  @ViewChild('keyword')
  inputEl!: ElementRef;

  form!: FormGroup;
  searchSubscription$!: Subscription;
  searchResults$!: Observable<Product[]>;

  ngOnInit(): void {
    this.createForm();
    // subscribe to search input box's value changes to render 'live search' results
    this.searchSubscription$ = this.form.valueChanges
      .pipe(
        map((form) => form['keyword']),
        filter((keyword) => keyword.trim().length > 0),
        debounceTime(500)
      )
      .subscribe({
        next: (keyword) => {
          this.searchResults$ =
            this.productService.getProductsBySearchKeyword(keyword);
        },
        error: (error) => console.error(error),
      });
  }

  ngOnDestroy(): void {
    this.searchSubscription$.unsubscribe();
  }

  // invoked when Enter key is pressed or Search button is clicked
  searchProducts(keyword: string) {
    this.router.navigate(['/search', keyword]);
    this.clearSearch();
  }

  clearSearch(): void {
    this.inputEl.nativeElement.value = '';
  }

  onClickingSearchResult(id: number) {
    this.router.navigate(['/products', id]);
    this.clearSearch();
  }

  private createForm(): void {
    this.form = this.fb.group({
      keyword: this.fb.control<string>(''),
    });
  }
}
