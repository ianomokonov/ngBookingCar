import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoadingService } from '../services/loading.service';
import { SessionStorageService } from '../session-storage';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private ss: SessionStorageService) {}

  public intercept(req: HttpRequest<{}>, next: HttpHandler): Observable<HttpEvent<{}>> {
    let params = req;
    if (this.ss.getItem('bookingUserToken')) {
      let token = this.ss.getItem('bookingUserToken');
      const paramReq = req.clone({
        params: req.params.set('token', token),
      });
      params = paramReq;
    }
    return next.handle(params);
  }
}
