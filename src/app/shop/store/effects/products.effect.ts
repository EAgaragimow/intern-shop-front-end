import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';

import { map, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';

import * as fromServices from './../../../shared/services';
import * as productsActions from '../actions/products.action';
import { Product } from '../../../shared/models/product.model';

@Injectable()
export class ProductsEffects {
  constructor(
    private actions$: Actions,
    private productsService: fromServices.ProductsService
  ) {}

  @Effect()
  loadProducts$: any = this.actions$.pipe(
    ofType(productsActions.LOAD_PRODUCTS),
    switchMap(() => {
      return this.productsService
        .getProducts()
        .pipe(
          map((response: any) => {
            return new productsActions.LoadProductsSuccess(response['products']);
          }),
          catchError((error: Error) => of(new productsActions.LoadProductsFail(error)))
        );
    })
  );
  
  @Effect()
  applyFilters$: any = this.actions$.pipe(
    ofType(productsActions.APPLY_FILTERS),
    switchMap((action: productsActions.ApplyFilters) => {
      return this.productsService
        .getProducts(action['payload'])
        .pipe(
          map((response: any) => {
            return new productsActions.LoadProductsSuccess(response['products']);
          }),
          catchError((error: Error) => of(new productsActions.LoadProductsFail(error)))
        );
    })
  );
}
