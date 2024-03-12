import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { takeWhile } from 'rxjs/internal/operators';
import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'bk-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  public links = [{ title: 'USER.ORDERS', fragment: 'history', class: 'fas fa-history' }];
  rxAlive: boolean = true;
  constructor(public route: ActivatedRoute, private api: ApiService, private loadingService: LoadingService,) {}

  ngOnInit(): void {
    this.api
      .checkAccess()
      .pipe(takeWhile(() => this.rxAlive))
      .subscribe((isAdmin) => {
        if (isAdmin) {
          this.links.push(
            { title: 'MENU.CARS', fragment: 'cars', class: 'fas fa-car' },
            { title: 'USER.PLACES', fragment: 'places', class: 'fas fa-map-marker-alt' },
            { title: 'USER.PLACES_OF_INTEREST', fragment: 'places-of-interest', class: 'fas fa-map-marked-alt' },
            { title: 'USER.MAIN_SLIDER', fragment: 'main-slider', class: 'fas fa-book-open' },
            { title: 'USER.LOCATIONS', fragment: 'locations', class: 'fa fa-map' },
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
