import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'bk-edit-car',
  templateUrl: './edit-car.component.html',
  styleUrls: ['./edit-car.component.scss'],
})
export class EditCarComponent {
  car;

  public carForm: FormGroup;

  constructor(private fb: FormBuilder, private api: ApiService, private router: Router, private route: ActivatedRoute) {
    this.carForm = this.fb.group({
      img: [null, Validators.required],
      name: [null, Validators.required],
      description: [null, Validators.required],
      price: [null, Validators.required],
      fuelType: [null, Validators.required],
      engineVolume: [null],
      enginePower: [null, Validators.required],
      speed: [null],
      time: [null],
      volumePerHundred: [null],
      kpp: [null, Validators.required],
      driveUnit: [null, Validators.required],
      places: [null, Validators.required],
      backVolume: [null],
      license: [null],
      createYear: [null, Validators.required],
    });

    this.carForm.valueChanges.subscribe((v) => {
      console.log(v);
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
      }
      return;
    }
    const newCar = this.carForm.getRawValue();
    this.uploadCarImg(newCar.img).subscribe((data) => {
      newCar.img = data;
      if (this.car) {
        newCar.id = this.car.id;
        newCar.oldImg = this.car.img;
        this.api.updateCar(newCar).subscribe(() => {
          this.updateCar(this.car.id);
        });
      } else {
        this.api.addCar(newCar).subscribe((carId) => {
          this.router.navigate(['../edit-car', carId]);
        });
      }
    });
  }

  updateCar(id) {
    this.api.getCar(id).subscribe((car) => {
      this.car = car;
      this.carForm.patchValue(car);
    });
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
