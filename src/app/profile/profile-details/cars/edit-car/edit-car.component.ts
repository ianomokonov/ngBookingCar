import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'bk-edit-car',
  templateUrl: './edit-car.component.html',
  styleUrls: ['./edit-car.component.scss'],
})
export class EditCarComponent implements OnInit {
  car = {
    img: '../../../assets/cars/logan_new.jpeg',
    name: 'Renault Logan II MT',
    year: 2017,
    description:
      'Аренда Рено Логан. - демократичный и надёжный седан, с большим багажником и энергоёмкой подвеской. Оптимальное решение, если вы хотите получить хороший уровень комфорта по приемлемой цене.',
    price: 1805,
    engineType: 'Бензиновый, 16',
    enginePower: 82,
    speed: 172,
    time: 11.9,
    volumPerHundred: 7.2,
    kpp: 'Механическая',
    driveUnit: 'Передний',
    place: 5,
    backVolume: 510,
  };

  carImg: File;

  public carForm: FormGroup;

  constructor(private fb: FormBuilder) {
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
  }

  ngOnInit(): void {}

  saveFile({
    target: {
      files: [file],
    },
  }) {
    const name = file?.name as string;
    if (name && (name.endsWith('.png') || name.endsWith('.jpg') || name.endsWith('.jpeg'))) {
      this.carImg = file;
    }
  }

  saveCar(){
    if(this.carForm.invalid){
     for(const control of Object.values(this.carForm.controls)){
      if(control.invalid){
        control.markAsDirty();
      }
     }
     return;
    }
    const newCar = this.carForm.getRawValue();
  }
}
