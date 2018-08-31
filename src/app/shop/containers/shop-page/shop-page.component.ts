import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { select, Store} from '@ngrx/store';
import { Product } from '../../../shared/models/product.model';
import { Category } from '../../../shared/models/category.model';
import { FiltersObject } from '../../../shared/models/filters.model';
import * as fromStore from '../../store';
import * as fromProductsSelectors from '../../store/selectors/products.selector';
import * as fromCategoriesSelectors from '../../store/selectors/categories.selector';

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
  loadingProducts$: Observable<boolean>;
  loadingCategories$: Observable<boolean>;

  constructor(private store: Store<fromStore.ShopState>) {
    this.loadingProducts$ = this.store.pipe(select(fromProductsSelectors.getProductsLoading));
    this.loadingCategories$ = this.store.pipe(select(fromCategoriesSelectors.getIsCategoriesLoading));

    this.products$ = this.store.pipe(select(fromProductsSelectors.getAllProducts));
    this.categories$ = this.store.pipe(select(fromCategoriesSelectors.getAllCategories));
    this.viewMode$ = this.store.pipe(select(fromProductsSelectors.getProductsViewMode));
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

  private addToCart($event: string): void {
    // TODO dispatch to card
    // event - id
  }
}
