import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../models/product';

@Injectable()
export class FittingService {
  selectedProductForFitting = new BehaviorSubject<Product>(new Product(0, '', '', '', 0, '', false, 0, new Date(), new Date()));
}

