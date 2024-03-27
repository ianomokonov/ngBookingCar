import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { LoadingService } from './services/loading.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/internal/operators';
import { Title, Meta } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, forkJoin, of } from 'rxjs';
import { keywords } from './utils/constants';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'ngBookingCar';
  constructor(
    public loadingService: LoadingService,
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title,
    private meta: Meta,
    private translation: TranslateService
  ) {
    loadingService.changeDetectorRef = cdRef;
    translation.use('en');
  }

  ngOnInit() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.route),
        map((route: ActivatedRoute) => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        // так же мы выбираем только первичные аутлеты (тоже опционально)
        filter((route: ActivatedRoute) => route.outlet === 'primary'),
        // выбираем title
        mergeMap((route) => {
          return of([(route.data as BehaviorSubject<any>).value, (route.params as BehaviorSubject<any>).value]);
        })
      )
      // задаем
      .subscribe(([data, params]) => {
        if (params.location) {
          data = (keywords[this.translation.currentLang] || keywords['en'])?.[params.location];
        }
        this.titleService.setTitle(data.title ? data.title : 'CARS4CRETE');
        if (this.meta.getTag('name=description')) {
          this.meta.updateTag({
            name: 'description',
            content: data.description,
          });
        } else {
          this.meta.addTag({
            name: 'description',
            content: data.description,
          });
        }

        if (this.meta.getTag('name=keywords')) {
          this.meta.updateTag({
            name: 'keywords',
            content: data.keywords,
          });
        } else {
          this.meta.addTag({
            name: 'keywords',
            content: data.keywords,
          });
        }
      });
  }
}
