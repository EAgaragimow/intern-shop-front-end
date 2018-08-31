import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';

import { Observable, of } from 'rxjs';

@Injectable()
export class NotificationService {

    private barConfig: MatSnackBarConfig = {
      duration: 5000,
      panelClass: 'app-notification-text'
    };

    private barConfigError: MatSnackBarConfig = {
      duration: 5000,
      panelClass: 'app-notification-text-error'
    };

    constructor(public snackBar: MatSnackBar) { }

    public showNotification (
      message: string = '',
      isError: boolean = false
    ): Observable<any> {

      const config: MatSnackBarConfig = isError ? this.barConfigError : this.barConfig;
      Promise.resolve(true)
        .then(() => {
          this.snackBar.open(
            message,
            null,
            config
          );
        });

      return of({
        message,
        isError
      });

    }
}
