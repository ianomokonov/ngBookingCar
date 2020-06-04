import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/internal/operators';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SessionStorageService } from '../session-storage';

@Injectable()
export class ProfileGuard implements CanActivate {
  constructor(private router: Router, private translate: TranslateService, private ss: SessionStorageService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    let token = this.ss.getItem('bookingUserToken');
    if (token) {
      return true;
      // return this.api.checkAccess().pipe(
      //   tap((isAdmin) => {
      //     console.log(isAdmin)
      //     if (!isAdmin) {
      //       this.router.navigate(['enter']);
      //     }
      //   })
      // );
    }
    this.router.navigate([this.translate.currentLang, 'enter']);
    return false;
  }
}
