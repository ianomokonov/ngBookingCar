import { Component, ChangeDetectorRef } from '@angular/core';
import { LoadingService } from './services/loading.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'ngBookingCar';
  constructor(public loadingService: LoadingService, private cdRef: ChangeDetectorRef) {
    loadingService.changeDetectorRef = cdRef;
  }
}
