import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ToastType } from '../../models/toaster-input.model';
import { ToasterService } from '../toaster.service';

export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(private toast: ToasterService) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMsg = '';
          if (error.error instanceof ErrorEvent) {
            errorMsg = `Error: ${error.error.message}`;
            this.toast.showToast({
              type: ToastType.danger,
              title: 'Application Error',
              content: errorMsg
            });
          } else {
            errorMsg = `Error Code: ${error.status},  Message: ${error.message}`;
            this.toast.showToast({
              type: ToastType.danger,
              title: 'Service Error',
              content: errorMsg
            });
          }
          return throwError(errorMsg);
        })
      );
  }
}
