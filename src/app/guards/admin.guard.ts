import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/internal/operators';
import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private router: Router, private api: ApiService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    let token = sessionStorage.getItem('bookingUserToken');
    if (token) {
      return this.api.checkAccess().pipe(
        tap((isAdmin) => {
          if (!isAdmin) {
            this.router.navigate(['/profile']);
          }
        })
      );
    }
    this.router.navigate(['/enter']);
    return false;
  }
}
