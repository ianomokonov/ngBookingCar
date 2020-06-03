import { Component, OnInit } from '@angular/core';
import { PlaceOfInterest } from '../models/place-of-interest';
import { ApiService } from '../services/api.service';
import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'bk-about-crete',
  templateUrl: './about-crete.component.html',
  styleUrls: ['./about-crete.component.scss'],
})
export class AboutCreteComponent implements OnInit {
  public rating = 3.5;
  public placesOfInterest: PlaceOfInterest[] = [];
  constructor(private api: ApiService, private loadingService: LoadingService) {}

  ngOnInit(): void {
    this.api.getPlacesOfInterest().subscribe(places => {
      this.placesOfInterest = places;
    })
  }
}
