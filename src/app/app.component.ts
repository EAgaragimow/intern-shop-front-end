import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AuthState } from './auth/store/reducers/auth.reducers';
import { AuthService } from './auth/services/auth.service';
import * as authStore from './auth/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public title: string = 'app';
  loading$: Observable<boolean>;
  constructor (private store: Store<AuthState>, private authService: AuthService) {
    // this.loading$ = this.store.pipe(
    //   select(authStore.getIsAuthenticationLoading)
    // );
  }

  ngOnInit(): void {
    // this.store.dispatch(new authStore.GetUserInfoAction(this.authService.getToken()));
  }
}
