import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Car } from '../models/car';
import { LoadingService } from '../services/loading.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Feedback } from '../models/feedback';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'bk-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
})
export class FeedbackComponent implements OnInit {
  cars: Car[] = [];
  choosedCar: Car;
  feedbackForm: FormGroup;
  feedbacks: Feedback[];
  constructor(private api: ApiService, private loadingService: LoadingService, private fb: FormBuilder) {
    this.feedbackForm = this.fb.group({
      userName: [null, Validators.required],
      carId: [null, Validators.required],
      raiting: [0],
      message: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    const subscription = forkJoin([this.api.getCars(), this.api.getFeedbacks()]).subscribe(
      ([cars, feedbacks]) => {
        this.cars = cars;
        this.feedbacks = feedbacks;
        this.loadingService.removeSubscription(subscription);
      },
      (error) => {
        this.loadingService.removeSubscription(subscription);
      }
    );
    this.loadingService.addSubscription(subscription);
  }

  selectCar(car: Car) {
    this.choosedCar = car;
    this.feedbackForm.get('carId').setValue(car.id);
  }

  send() {
    if (this.feedbackForm.invalid) {
      this.feedbackForm.markAllAsTouched();
      return;
    }

    const subscription = this.api.addFeedback(this.feedbackForm.getRawValue()).subscribe(
      (isAdded) => {
        this.loadingService.removeSubscription(subscription);
        if (isAdded) {
          this.ngOnInit();
        }
      },
      () => {
        this.loadingService.removeSubscription(subscription);
      }
    );
    this.loadingService.addSubscription(subscription);
  }
}
