import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor() {}

  public intercept(req: HttpRequest<{}>, next: HttpHandler): Observable<HttpEvent<{}>> {
    if (sessionStorage.getItem('bookingUserToken')) {
        let token=sessionStorage.getItem('bookingUserToken');
        const paramReq = req.clone({
            params: req.params.set('token', token)
        });
        return next.handle(paramReq);
    } else {
        return next.handle(req);
    }
  }
}
