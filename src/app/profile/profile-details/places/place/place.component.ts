import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { Place } from 'src/app/models/place';
import { LoadingService } from 'src/app/services/loading.service';

// @Component({
//   selector: 'bk-place',
//   templateUrl: './place.component.html',
//   styleUrls: ['./place.component.scss'],
// })
export class PlaceComponent implements OnInit {
  public placeInstanse: Place;

  @Input() set place(place: Place) {
    this.placeInstanse = place;
    this.placeControl.patchValue(place.name);
  }

  @Output() placeUpdated: EventEmitter<{}> = new EventEmitter();

  public placeControl: FormControl;

  constructor(private api: ApiService, private loadingService: LoadingService,) {
    this.placeControl = new FormControl(null, [Validators.required]);
  }

  ngOnInit(): void {}

  addPlace() {
    if (this.placeControl.invalid) {
      this.placeControl.markAsDirty();
      return;
    }
    const subscription = this.api.addPlace({ name: this.placeControl.value }).subscribe(() => {
      this.placeUpdated.emit();
      this.placeControl.markAsPristine();
      this.placeControl.setValue(null);
      this.loadingService.removeSubscription(subscription);
    });
    this.loadingService.addSubscription(subscription);
  }

  deletePlace() {
    if (this.placeControl.invalid || !this.placeInstanse.id) {
      this.placeControl.markAsDirty();
      return;
    }
    const subscription = this.api.deletePlace(this.placeInstanse.id).subscribe(() => {
      this.placeUpdated.emit();
      this.loadingService.removeSubscription(subscription);
    });
    this.loadingService.addSubscription(subscription);
  }

  updatePlace() {
    if (this.placeControl.invalid || !this.placeInstanse.id) {
      this.placeControl.markAsDirty();
      return;
    }
    const subscription = this.api.updatePlace({ id: this.placeInstanse.id, name: this.placeControl.value }).subscribe(() => {
      this.placeUpdated.emit();
      this.loadingService.removeSubscription(subscription);
    });
    this.loadingService.addSubscription(subscription);
  }
}
