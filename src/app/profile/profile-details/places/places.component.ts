import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Place } from 'src/app/models/place';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'bk-places',
  templateUrl: './places.component.html',
  styleUrls: ['./places.component.scss']
})
export class PlacesComponent implements OnInit {

  places: Place[];

  constructor(private api: ApiService, private loadingService: LoadingService,) { }

  ngOnInit(): void {
    this.updatePlaces();
  }

  updatePlaces(){
    const subscription = this.api.getPlaces().subscribe(places => {
      this.places = places;
      this.loadingService.removeSubscription(subscription);
    })
    this.loadingService.addSubscription(subscription);
  }

}
