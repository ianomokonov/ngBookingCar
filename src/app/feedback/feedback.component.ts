import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Car } from '../models/car';
import { LoadingService } from '../services/loading.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'bk-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
})
export class FeedbackComponent implements OnInit {
  cars: Car[] = [];
  choosedCar: Car;
  feedbackForm: FormGroup;
  constructor(private api: ApiService, private loadingService: LoadingService, private fb: FormBuilder) {
    this.feedbackForm = this.fb.group({
      carId: [null, Validators.required],
      raiting: [0],
      message: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    const subscription = this.api.getCars().subscribe((cars) => {
      this.cars = cars;
      this.loadingService.removeSubscription(subscription);
    });
    this.loadingService.addSubscription(subscription);
  }

  selectCar(car: Car) {
    this.choosedCar = car;
    this.feedbackForm.get('carId').setValue(car.id);
  }

  send(){
    if(this.feedbackForm.invalid){
      this.feedbackForm.markAllAsTouched();
      return;
    }

    console.log(this.feedbackForm.getRawValue())
  }
}
