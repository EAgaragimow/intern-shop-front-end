import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';

import { Product } from '../../../shared/models/product.model';
import { Category } from '../../../shared/models/category.model';
import { FiltersObject } from './../../../shared/models/filters.model';
import * as fromStore from '../../store';
import * as fromProductsSelectors from '../../store/selectors/products.selector';
import * as fromCategoriesSelectors from '../../store/selectors/categories.selector';
import { AddToCart } from '../../../cart/store/actions/cart.action';
import { WishAddNew } from '../../../wishlist/store/actions/wish.action';
import { getWishIds } from '../../../wishlist/store/selectors/wish.selector';

@Component({
  selector: 'app-shop',
  templateUrl: './shop-page.component.html',
  styleUrls: ['./shop-page.component.css']
})
export class ShopPageComponent implements OnInit {

  products$: Observable<Product[]>;
  categories$: Observable<Category[]>;
  viewModeValue: boolean = false;
  viewMode$: Observable<string>;
  filters$: Observable<FiltersObject>;
  wisheIds$: Observable<string[]>;

  constructor(private store: Store<fromStore.ShopState>) {
    this.products$ = this.store.pipe(select(fromProductsSelectors.getAllProducts));
    this.categories$ = this.store.pipe(select(fromCategoriesSelectors.getAllCategories));
    this.viewMode$ = this.store.pipe(select(fromProductsSelectors.getProductsViewMode));
    this.wisheIds$ = this.store.pipe(select(getWishIds));
    localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViODZkYWY0NTY2Zjg2MWVlMDgzODJmOCIsImxvZ2luIjoiRWx2aW4iLCJwYXNzd29yZCI6IiQyYiQxMiRGZFJkLldpRUhVR3pvSmpicEVhWmRlVjFvT2FkOGRYNGFKUHZFbGlKNjE3V2lyVVdUWVVnTyIsImlhdCI6MTUzNTc1MjUxMCwiZXhwIjoxNTM1NzU1MjEwfQ.F-Zhti-2ZJpbSkiuPYM5XwbMtcRyt45JleOvLLdRsLY');
  }

  ngOnInit(): void {
    this.store.dispatch(new fromStore.LoadProducts());
    this.store.dispatch(new fromStore.LoadCategories());
  }

  chooseViewMode(viewMode: string): void {
    if (viewMode === 'grid') {
      this.viewModeValue = false;
    } else {
      this.viewModeValue = true;
    }
    this.store.dispatch(new fromStore.ChangeViewMode(viewMode));
  }

  filters(filters: FiltersObject): void {
    this.store.dispatch(new fromStore.ApplyFilters(filters));
  }

  clearFilters(filters: FiltersObject): void {
    this.store.dispatch(new fromStore.ApplyFilters(filters));
  }

  addToCart($event: Product): void {
    this.store.dispatch(new AddToCart({
      product: $event,
      quantity: 1
    }));
  }

  addToWish($event: Product): void {
    this.store.dispatch(new WishAddNew($event));
  }
}
