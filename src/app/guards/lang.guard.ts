import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/internal/operators';
import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import { LoadingService } from '../services/loading.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class LangGuard implements CanActivate {
  constructor(private router: Router, private translate: TranslateService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    const lang = state.url.indexOf('/en/') > -1 ? 'en' : 'ru';
    if (this.translate.currentLang != lang) {
      this.translate.use(lang);
    }

    return true;
  }
}
