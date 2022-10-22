import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { locations } from '../utils/constants';

@Component({
  selector: 'bk-rental-locations',
  templateUrl: './rental-locations.component.html',
  styleUrls: ['./rental-locations.component.scss'],
})
export class RentalLocationsComponent implements OnInit {
  public activeLocation;

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({ location }) => {
      this.activeLocation = locations.find((l) => l.path === location);
    });
  }
}
