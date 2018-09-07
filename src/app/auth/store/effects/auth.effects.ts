import { Injectable } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import * as authActions from '../actions/auth.actions';
import { catchError, map, switchMap } from 'rxjs/operators';
import {
  AuthenticationErrorAction, AuthenticationSuccessAction, GetUserInfoFailAction,
  GetUserInfoSuccessAction, SignUpSuccessAction
} from '../actions/auth.actions';
import { Go } from '../../../store/actions/router.action';
import { User } from '../../models/user';
import { AppNotificationShow } from '../../../store/actions/notification.action';
import { mergeMap } from 'rxjs/internal/operators';

@Injectable()
export class AuthEffects {
  constructor(private actions$: Actions, private authService: AuthService) { }

  @Effect()
  signIn$: Observable<Action> = this.actions$.pipe(
    ofType(authActions.AUTHENTICATE),
    switchMap((action: authActions.AuthenticateAction) => {
      return this.authService
        .logIn(action['payload'].login, action['payload'].password)
        .pipe(
          map((user: User) => {
            return new AuthenticationSuccessAction({ login: action['payload'].login, password: action['payload'].password, token: user.token });
          }),
          catchError((error: Error) => {
            return of(new AuthenticationErrorAction(error));
          })
        );
    })
  );

  @Effect()
  signUp$: Observable<Action> = this.actions$.pipe(
    ofType(authActions.SIGN_UP),
    switchMap((action: authActions.SignUpAction) => {
      return this.authService.signUp(action['payload'].login, action['payload'].password)
        .pipe(
          map((user: User) => {
            return new SignUpSuccessAction({ token: user.token });
          }),
          catchError((error: Error) => {
            return of(new AuthenticationErrorAction({ error: error }));
          })
        );
    })
  );

  @Effect()
  signInSuccess$: Observable<Action> = this.actions$.pipe(
    ofType(authActions.AUTHENTICATE_SUCCESS),
    switchMap((action: authActions.AuthenticationSuccessAction) => {
      return this.authService.getUser(action['payload'].token).pipe(
        mergeMap((user) => [
          new GetUserInfoSuccessAction(action['payload']),
          new AppNotificationShow({ message: `User is logged in as "${action['payload'].login}"`, isError: false }),
          new Go({ path: ['', 'shop'] })
        ]),
        catchError((error: Error) => of(new GetUserInfoFailAction(error)))
      );
    })
  );

  @Effect()
  signUpSuccess$: Observable<any> = this.actions$.pipe(
    ofType(authActions.SIGN_UP_SUCCESS),
    switchMap((action: authActions.SignUpSuccessAction) => {
      return this.authService.getUser(action['payload'].token).pipe(
        mergeMap((user: User) => [
          new GetUserInfoSuccessAction(user),
          new AppNotificationShow({ message: `"${user.login}" was successfully registered`, isError: false }),
          new Go({ path: ['', 'shop'] })
        ]),
        catchError((error: Error) => of(new GetUserInfoFailAction(error)))
      );
    }),
  );

  @Effect()
  getUser$: Observable<Action> = this.actions$.pipe(
    ofType(authActions.GET_USER_INFO),
    switchMap((action: authActions.GetUserInfoAction) => {
      debugger;
      if (!action.payload) {
        return of(new GetUserInfoFailAction('no token'));
      }
      return this.authService.getUser(action.payload).pipe(
        mergeMap((user: User) => [
          new GetUserInfoSuccessAction(user),
          new Go({ path: ['', 'shop'] })
        ]),
        catchError((error: Error) => of(new GetUserInfoFailAction({ error: error })))
      );
    })
  );

  @Effect()
  signOut$: Observable<Action> = this.actions$.pipe(
    ofType(authActions.SIGN_OUT),
    mergeMap(() => [
      new AppNotificationShow({ message: 'You are signed out', isError: false }),
      new Go({ path: ['', 'login'] })
    ])
  );

  @Effect() onFail$: Observable<Action> = this.actions$.pipe(
    ofType(authActions.GET_USER_INFO_FAIL),
    map((fail: (authActions.GetUserInfoFailAction)) => {
      console.log(fail);

      return new authActions.SignOutAction();
    })
  );

  @Effect() onError$: Observable<Action> = this.actions$.pipe(
    ofType(authActions.AUTHENTICATE_ERROR),
    map((error: (authActions.AuthenticationErrorAction)) => {
      console.log(error);

      return new authActions.SignOutAction();
    })
  );
}
