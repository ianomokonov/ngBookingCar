import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../models/user';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { takeWhile } from 'rxjs/internal/operators';

@Component({
  selector: 'bk-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit, OnDestroy {
  public user: User;
  private rxAlive: boolean = true;
  constructor(private api: ApiService, private auth: AuthService) {}

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
      this.api.getUserInfo().subscribe((user) => {
        this.user = user;
      });
    }
  }
}
