import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Car } from '../models/car';
import { LoadingService } from '../services/loading.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Feedback } from '../models/feedback';
import { forkJoin } from 'rxjs';
import { AuthService } from '../services/auth.service';

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
  constructor(private api: ApiService, private loadingService: LoadingService, private fb: FormBuilder, private userService: AuthService) {
    this.feedbackForm = this.fb.group({
      userName: [null, Validators.required],
      carId: [null, Validators.required],
      raiting: [0],
      message: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    let queries = [this.api.getCars(), this.api.getFeedbacks()];
    if (this.userService.getToken()) {
      queries.push(this.api.getUserInfo());
    }
    const subscription = forkJoin(queries).subscribe(
      ([cars, feedbacks, user]) => {
        if (user) {
          this.feedbackForm.get('userName').setValue(`${user.surname} ${user.name} ${user.middlename}`, { emitEvant: false });
        }
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
