import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError } from 'rxjs/operators';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  constructor(private snackbar: MatSnackBar) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let newReq = request.clone({
      headers: request.headers
        .set('Access-Control-Allow-Origin', '*')
        .set('authkey', 'hWuFhhPVij'),
    });

    return next.handle(newReq).pipe(
      catchError((error: HttpErrorResponse) => {
        // showing the error message in this.snackbar
        this.snackbar.open(error?.error?.message || error?.error?.error, 'X', {
          duration: 5000,
          horizontalPosition:'end',
          verticalPosition:'top'
        });
        console.log('API Error:', error?.error?.error);
        return throwError(error);
      })
    ) as Observable<HttpEvent<any>>;
  }
}