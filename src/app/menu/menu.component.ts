import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../models/user';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { takeWhile } from 'rxjs/internal/operators';
import { LoadingService } from '../services/loading.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { LocationShort } from '../models/location';

@Component({
  selector: 'bk-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit, OnDestroy {
  public user: User;
  public isAdmin = false;
  private rxAlive: boolean = true;
  public locations: LocationShort[] = [];
  constructor(
    private api: ApiService,
    private loadingService: LoadingService,
    private auth: AuthService,
    private router: Router,
    public translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.getUser();
    this.getLocations();

    this.auth.$userUpdate.pipe(takeWhile(() => this.rxAlive)).subscribe(() => {
      this.getUser();
    });
  }

  ngOnDestroy() {
    this.rxAlive = false;
  }

  getUser() {
    this.user = null;
    if (this.auth.getToken()) {
      this.api.checkAccess().subscribe((r) => {
        this.isAdmin = r;
      });
      const subscription = this.api.getUserInfo().subscribe((user) => {
        this.user = user;
        this.loadingService.removeSubscription(subscription);
      });
      this.loadingService.addSubscription(subscription);
    }
  }

  getLocations() {
    const subscription = this.api.getLocations().subscribe((locations) => {
      this.locations = locations;
      this.loadingService.removeSubscription(subscription);
    });
    this.loadingService.addSubscription(subscription);
  }

  changeLang(lang: string) {
    this.router.navigate([lang, ...this.router.routerState.snapshot.url.slice(4, this.router.routerState.snapshot.url.length).split('/')]);
  }
}
