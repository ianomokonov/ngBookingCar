import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'bk-place',
  templateUrl: './place.component.html',
  styleUrls: ['./place.component.scss'],
})
export class PlaceComponent implements OnInit {
  public placeInstanse: Place;

  @Input() set place(place: Place) {
    this.placeInstanse = place;
    this.placeControl.patchValue(place.name);
  }

  @Output() placeUpdated: EventEmitter<{}> = new EventEmitter();

  public placeControl: FormControl;

  constructor(private api: ApiService) {
    this.placeControl = new FormControl(null, [Validators.required]);
  }

  ngOnInit(): void {}

  addPlace() {
    if (this.placeControl.invalid) {
      this.placeControl.markAsDirty();
      return;
    }
    this.api.addPlace({ name: this.placeControl.value }).subscribe(() => {
      this.placeUpdated.emit();
      this.placeControl.markAsPristine();
      this.placeControl.setValue(null);
    });
  }

  deletePlace() {
    if (this.placeControl.invalid || !this.placeInstanse.id) {
      this.placeControl.markAsDirty();
      return;
    }
    this.api.deletePlace(this.placeInstanse.id).subscribe(() => {
      this.placeUpdated.emit();
    });
  }

  updatePlace() {
    if (this.placeControl.invalid || !this.placeInstanse.id) {
      this.placeControl.markAsDirty();
      return;
    }
    this.api.updatePlace({ id: this.placeInstanse.id, name: this.placeControl.value }).subscribe(() => {
      this.placeUpdated.emit();
    });
  }
}

export interface Place {
  id: number;
  name: string;
}
