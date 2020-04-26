import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Place } from './place/place.component';

@Component({
  selector: 'bk-places',
  templateUrl: './places.component.html',
  styleUrls: ['./places.component.scss']
})
export class PlacesComponent implements OnInit {

  places: Place[];

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.updatePlaces();
  }

  updatePlaces(){
    this.api.getPlaces().subscribe(places => {
      this.places = places;
    })
  }

}
