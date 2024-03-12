import { Component, OnInit, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { LoadingService } from 'src/app/services/loading.service';
import { PlaceOfInterest } from 'src/app/models/place-of-interest';
import { LocationShort } from 'src/app/models/location';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'bk-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.scss'],
})
export class LocationsComponent implements OnInit {
  places: LocationShort[];
  constructor(private api: ApiService, private loadingService: LoadingService, public translate: TranslateService) {}

  ngOnInit(): void {
    const subscription = this.api.getLocations().subscribe((places) => {
      this.places = places;
      this.loadingService.removeSubscription(subscription);
    });
    this.loadingService.addSubscription(subscription);
  }
}
