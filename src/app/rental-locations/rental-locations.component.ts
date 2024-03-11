import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { locations } from '../utils/locations';
import { ApiService } from '../services/api.service';
import { Location } from '../models/location';

@Component({
  selector: 'bk-rental-locations',
  templateUrl: './rental-locations.component.html',
  styleUrls: ['./rental-locations.component.scss'],
})
export class RentalLocationsComponent implements OnInit {
  public activeLocation: Location;

  constructor(private activatedRoute: ActivatedRoute, private api: ApiService) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({ location }) => {
      this.api.getLocation(location).subscribe((l) => {
        this.activeLocation = l;
      });
    });
  }
}
