import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/internal/operators';
import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import { LoadingService } from '../services/loading.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private router: Router, private api: ApiService, private translate: TranslateService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    let token = sessionStorage.getItem('bookingUserToken');
    if (token) {
      return this.api.checkAccess().pipe(
        tap((isAdmin) => {
          if (!isAdmin) {
            this.router.navigate([this.translate.currentLang, 'profile']);
          }
        })
      );
    }
    this.router.navigate([this.translate.currentLang, 'enter']);
    return false;
  }
}
