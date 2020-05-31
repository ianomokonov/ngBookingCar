import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { Place } from 'src/app/models/place';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'bk-place',
  templateUrl: './place.component.html',
  styleUrls: ['./place.component.scss'],
})
export class PlaceComponent implements OnInit {
  public placeInstanse: Place;

  @Input() set place(place: Place) {
    this.placeInstanse = place;
    this.placeForm.patchValue({name: place.name.ru, name_eng: place.name.en});
  }

  @Output() placeUpdated: EventEmitter<{}> = new EventEmitter();

  public placeForm: FormGroup;

  constructor(private api: ApiService, private loadingService: LoadingService, private fb: FormBuilder) {
    this.placeForm = fb.group({
      name: [null, Validators.required],
      name_eng: [null, Validators.required]
    })
  }

  ngOnInit(): void {}

  addPlace() {
    if (this.placeForm.invalid) {
      this.placeForm.markAllAsTouched();
      return;
    }
    const subscription = this.api.addPlace(this.placeForm.value).subscribe(() => {
      this.placeUpdated.emit();
      this.placeForm.markAsPristine();
      this.placeForm.reset();
      this.loadingService.removeSubscription(subscription);
    });
    this.loadingService.addSubscription(subscription);
  }

  deletePlace() {
    const subscription = this.api.deletePlace(this.placeInstanse.id).subscribe(() => {
      this.placeUpdated.emit();
      this.loadingService.removeSubscription(subscription);
    });
    this.loadingService.addSubscription(subscription);
  }

  updatePlace() {
    if (this.placeForm.invalid || !this.placeInstanse.id) {
      this.placeForm.markAllAsTouched();
      return;
    }
    const subscription = this.api.updatePlace({ id: this.placeInstanse.id, ...this.placeForm.value }).subscribe(() => {
      this.placeUpdated.emit();
      this.loadingService.removeSubscription(subscription);
    });
    this.loadingService.addSubscription(subscription);
  }
}
