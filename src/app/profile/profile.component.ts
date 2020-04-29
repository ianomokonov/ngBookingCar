import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { takeWhile } from 'rxjs/internal/operators';

@Component({
  selector: 'bk-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  public links = [{ title: 'История заказов', fragment: 'history', class: 'fas fa-history' }];
  rxAlive: boolean = true;
  constructor(public route: ActivatedRoute, private api: ApiService) {}

  ngOnInit(): void {
    this.api
      .checkAccess()
      .pipe(takeWhile(() => this.rxAlive))
      .subscribe((isAdmin) => {
        if (isAdmin) {
          this.links.push(
            { title: 'Автомобили', fragment: 'cars', class: 'fas fa-car' },
            { title: 'Места сдачи', fragment: 'places', class: 'fas fa-map-marker-alt' }
          );
        }
      });
  }
  ngOnDestroy() {
    this.rxAlive = false;
  }
  public getActive() {
    return this.route.firstChild ? this.route.firstChild.url['value'][0].path : '';
  }
}
