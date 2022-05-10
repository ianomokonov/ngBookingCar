import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'bk-edit-car',
  templateUrl: './edit-car.component.html',
  styleUrls: ['./edit-car.component.scss'],
})
export class EditCarComponent {
  car;

  public carForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private loadingService: LoadingService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.carForm = this.fb.group({
      img: [null, Validators.required],
      name: [null, Validators.required],
      description: [null, Validators.required],
      description_eng: [null, Validators.required],
      description_de: [null, Validators.required],
      summerPrice: [null, Validators.required],
      winterPrice: [null, Validators.required],
      fuelType: [null, Validators.required],
      bodyType: [null, Validators.required],
      engineVolume: [null],
      enginePower: [null, Validators.required],
      speed: [null],
      time: [null],
      consumption: [null],
      kpp: [null, Validators.required],
      driveUnit: [null, Validators.required],
      places: [null, Validators.required],
      backVolume: [null],
      license: [null],
      createYear: [null, Validators.required],
      class: [null, Validators.required],
      minAge: [null],
      doors: [null],
      ac: [null],
      abs: [null],
      airBags: [null],
      summerPrices: fb.group({
        oneDayPrice: [null, Validators.required],
        twoDaysPrice: [null, Validators.required],
        threeDaysPrice: [null, Validators.required],
        fourDaysPrice: [null, Validators.required],
        fiveDaysPrice: [null, Validators.required],
        sixDaysPrice: [null, Validators.required],
        sevenDaysPrice: [null, Validators.required],
      }),
      winterPrices: fb.group({
        oneDayPrice: [null, Validators.required],
        twoDaysPrice: [null, Validators.required],
        threeDaysPrice: [null, Validators.required],
        fourDaysPrice: [null, Validators.required],
        fiveDaysPrice: [null, Validators.required],
        sixDaysPrice: [null, Validators.required],
        sevenDaysPrice: [null, Validators.required],
      }),
    });

    this.route.params.subscribe((params) => {
      if (params.id) {
        this.updateCar(params.id);
      }
    });
  }

  public saveCar() {
    if (this.carForm.invalid) {
      for (const control of Object.values(this.carForm.controls)) {
        if (control.invalid) {
          control.markAsDirty();
        }
        if(control instanceof FormGroup){
          for (const ctrl of Object.values(control.controls)) {
            if (ctrl.invalid) {
              ctrl.markAsDirty();
            }
          }
        }
      }
      return;
    }
    const newCar = this.carForm.getRawValue();
    const uploadSubscription = this.uploadCarImg(newCar.img).subscribe((data) => {
      if (newCar.img instanceof File) {
        this.loadingService.removeSubscription(uploadSubscription);
      }
      newCar.img = data;
      if (this.car) {
        newCar.id = this.car.id;
        newCar.oldImg = this.car.img;
        const subscription = this.api.updateCar(newCar).subscribe(() => {
          this.updateCar(this.car.id);
          this.loadingService.removeSubscription(subscription);
        });
        this.loadingService.addSubscription(subscription);
      } else {
        const subscription = this.api.addCar(newCar).subscribe((carId) => {
          this.loadingService.removeSubscription(subscription);
          this.router.navigate(['../edit-car', carId]);
        });
        this.loadingService.addSubscription(subscription);
      }
    });
    if (newCar.img instanceof File) {
      this.loadingService.addSubscription(uploadSubscription);
    }
  }

  updateCar(id) {
    const subscription = this.api.getCar(id).subscribe((car) => {
      this.car = car;
      this.carForm.patchValue({...car, description: car.description.ru});
      this.loadingService.removeSubscription(subscription);
    });
    this.loadingService.addSubscription(subscription);
  }

  uploadCarImg(img): Observable<string> {
    if (img instanceof File) {
      const formData = new FormData();
      formData.append('CarImage', img, img.name.replace(' ', '_'));
      return this.api.uploadCarImg(formData);
    } else {
      return of(img);
    }
  }

  removeImg() {
    this.carForm.get('img').setValue(null);
  }

  isUploadFileShown() {
    const value = this.carForm.get('img').value;

    return !value || value instanceof File;
  }
}
