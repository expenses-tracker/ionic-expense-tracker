import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ToastType } from '../../models/toaster-input.model';
import { LoggerService } from '../logger.service';
import { ToasterService } from '../toaster.service';
import { TokenService } from '../token.service';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {

  constructor(
    private toast: ToasterService,
    private tokenService: TokenService,
    private logger: LoggerService,
    private router: Router) {
    this.logger.info(`Initialized ErrorInterceptor`);
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.tokenService.getToken();

    //Authentication by setting header with token value
    if (token) {
      request = request.clone({
        setHeaders: {
          authorization: `Bearer ${token}`
        }
      });
    }

    if (!request.headers.has('Content-Type')) {
      request = request.clone({
        setHeaders: {
          'content-type': 'application/json'
        }
      });
    }

    request = request.clone({
      headers: request.headers.set('Accept', 'application/json')
    });
    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          this.logger.debug(`HTTP Event: ${event.url} STATUS: ${event.status} CONTENT LENGTH: ${String(event.body).length}`);
        }
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        let errorMsg = '';
          if (error.error instanceof ErrorEvent) {
            errorMsg = `Error: ${error.error.message}`;
          } else {
            if (error.error) {
              errorMsg = error.error.message;
            } else {
              errorMsg = `Error Code: ${error.status},  Message: ${error.message}`;
            }
            if (error.status === 401) {
              this.router.navigateByUrl('/auth/login');
              errorMsg = 'You are not authorized. Please login.';
            }
          }
          this.toast.showToast({
            type: ToastType.danger,
            title: 'Error',
            content: errorMsg
          });
          // this.logger.error(error);
          return throwError(errorMsg);
      }));
  }
}
