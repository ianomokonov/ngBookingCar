import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../models/user';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { takeWhile } from 'rxjs/internal/operators';
import { LoadingService } from '../services/loading.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'bk-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit, OnDestroy {
  public user: User;
  private rxAlive: boolean = true;
  constructor(private api: ApiService, private loadingService: LoadingService, private auth: AuthService, private translate: TranslateService) {}

  ngOnInit(): void {
    this.getUser();

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
      const subscription = this.api.getUserInfo().subscribe((user) => {
        this.user = user;
        this.loadingService.removeSubscription(subscription);
      });
      this.loadingService.addSubscription(subscription);
    }
  }

  changeLang(lang: string){
    this.translate.use(lang);
  }
}
