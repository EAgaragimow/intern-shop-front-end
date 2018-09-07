import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of, zip } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { Store, select, Action } from '@ngrx/store';

import { State } from '../reducers';
import { Product } from 'src/app/shared/models/product.model';
import * as wishActions from '../actions/wish.action';
import { WishService } from '../../services/wish.service';
import * as wishSelectors from '../selectors/wish.selector';
import { User } from 'src/app/auth/models/user';
import { getAuthenticatedUser } from 'src/app/auth/store/selectors';
import * as authActions from 'src/app/auth/store/actions/auth.actions';
import { AppNotificationShow } from 'src/app/store/actions/notification.action';
import { productToArray } from 'src/app/shared/utils/productsToArray';

@Injectable()
export class WishEffects {

    private isSignUp: boolean = false;

    constructor( private actions$: Actions, private dataService: WishService , private store: Store<State>) { }

   @Effect()
   userSignUp$: Observable<Action> = this.actions$
       .pipe(ofType(authActions.SIGN_UP_SUCCESS))
       .pipe(
           switchMap((): any => {
                this.isSignUp = true;

                return of({type: 'EMPTY'});
            })
        );

    @Effect()
    addWish$: Observable<Action> = this.actions$
        .pipe(ofType(wishActions.WISH_ADD_NEW))
        .pipe(
            switchMap((action: wishActions.WishAddNew): any => {
                return zip(
                    this.store.pipe(select(wishSelectors.getWishProducts)),
                    this.store.pipe(select(getAuthenticatedUser)),
                    this.store.pipe(select(wishSelectors.getWishIds))
                ).pipe(
                    switchMap((data: [Product[], User, string[]]) => {
                        if (!data[1]) {
                           return of(new AppNotificationShow({message: 'You should log in', isError: true}));
                        }

                        if (data[2].indexOf(action.payload.id) === -1) {
                            data[0].push(action.payload);

                            return this.saveWishlist(data, action.payload);
                        }

                        return of(new AppNotificationShow({message: 'You already have this product', isError: false}));
                    }),
                    catchError((err: Error) => of(new AppNotificationShow({message: err.message, isError: true})))
                );
            })
        );

    @Effect()
    removeWish$: Observable<Action> = this.actions$
        .pipe(ofType(wishActions.WISH_REMOVE_PRODUCT))
        .pipe(
            switchMap((action: wishActions.WishRemoteProduct): any => {
                return zip(
                    this.store.pipe(select(wishSelectors.getWishProductsInObject)),
                    this.store.pipe(select(getAuthenticatedUser))
                ).pipe(
                    switchMap((data: [{[id: string]: Product}, User]) => {
                        if (data[1] !== null) {
                            delete data[0][action.payload];

                            return this.removeWishlist(data, action.payload);
                        }

                        return of(new AppNotificationShow({message: 'You should log in', isError: true}));
                    }),
                    catchError((err: Error) => of(new AppNotificationShow({message: err.message, isError: true})))
                );
            })
        );

    @Effect()
    getWishes$: Observable<Action> = this.actions$
        .pipe(ofType(authActions.GET_USER_INFO_SUCCESS))
        .pipe(
            switchMap((action: authActions.SignUpAction): any => {
                if (this.isSignUp) {
                    this.isSignUp = false;

                    return this.dataService.createWishList(action.payload, []).pipe(
                        map((products: any) => new wishActions.WishDownloadDone([])),
                        catchError((err2: Error) => of(new AppNotificationShow({message: err2.message, isError: true})))
                    );
                }

                return this.dataService.getWishes(action.payload).pipe(
                    map((products: Product[]) => new wishActions.WishDownloadDone(products)),
                    catchError((err: Error) => of())
                );
            })
        );

    @Effect()
    signOut$: Observable<Action> = this.actions$
        .pipe(ofType(authActions.SIGN_OUT))
        .pipe(
            switchMap(() => of(new wishActions.WishIsCleaned()))
        );

    private saveWishlist(data: any, product: Product): Observable<any> {
        return this.dataService.updateWishes(data[1], productToArray(data[0])).pipe(
            map((success: boolean) => {
                if (success) {
                    return new wishActions.WishAddNewSuccess(product);
                }

                return new AppNotificationShow({message: 'Server error', isError: true});

            }),
            catchError((err: Error) => {
                return this.dataService.createWishList(data[1], productToArray(data[0])).pipe(
                    map((products: any) => new wishActions.WishAddNewSuccess(product)),
                    catchError((err2: Error) => of(new AppNotificationShow({message: err2.message, isError: true})))
                );
            })
        );
    }

    private removeWishlist(data: [{[id: string]: Product}, User], productId: string): Observable<any> {
        return this.dataService.updateWishes(data[1], productToArray(data[0])).pipe(
            map((success: boolean) => {
                if (success) {
                    return new wishActions.WishRemoteProductSuccess(productId);
                }

                return new AppNotificationShow({message: 'Server error', isError: true});
            }),
            catchError((err: Error) => of(new AppNotificationShow({message: 'Program error', isError: true})))
        );
    }

}
