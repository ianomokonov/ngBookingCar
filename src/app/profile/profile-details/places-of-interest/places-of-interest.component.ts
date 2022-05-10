import { Component, OnInit, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { LoadingService } from 'src/app/services/loading.service';
import { PlaceOfInterest } from 'src/app/models/place-of-interest';

@Component({
  selector: 'bk-places-of-interest',
  templateUrl: './places-of-interest.component.html',
  styleUrls: ['./places-of-interest.component.scss']
})
export class PlacesOfInterestComponent implements OnInit {
  placeForm: FormGroup;
  place: PlaceOfInterest;
  places: PlaceOfInterest[];
  constructor(private fb: FormBuilder, private api: ApiService, private loadingService: LoadingService) {
    this.placeForm = fb.group({
      img: [null, Validators.required],
      name: [null, Validators.required],
      name_eng: [null, Validators.required],
      name_de: [null, Validators.required],
      description: [null, Validators.required],
      description_eng: [null, Validators.required],
      description_de: [null, Validators.required],
      road: [null, Validators.required],
      road_eng: [null, Validators.required],
      road_de: [null, Validators.required],
      rating: null
    })
   }

  ngOnInit(): void {
    this.place = null;
    this.placeForm.reset();
    const subscription = this.api.getPlacesOfInterest().subscribe(places => {
      this.places = places;
      this.loadingService.removeSubscription(subscription);
    })
    this.loadingService.addSubscription(subscription);
  }

  public savePlace() {
    if (this.placeForm.invalid) {
      for (const control of Object.values(this.placeForm.controls)) {
        if (control.invalid) {
          control.markAsDirty();
        }
      }
      return;
    }
    const newPlace = this.placeForm.getRawValue();
    const uploadSubscription = this.uploadPlaceImg(newPlace.img).subscribe((data) => {
      if (newPlace.img instanceof File) {
        this.loadingService.removeSubscription(uploadSubscription);
      }
      newPlace.img = data;
      if (this.place) {
        newPlace.id = this.place.id;
        newPlace.oldImg = this.place.img;
        const subscription = this.api.updatePlaceOfInterest(newPlace).subscribe(() => {
          this.ngOnInit();
          this.loadingService.removeSubscription(subscription);
        });
        this.loadingService.addSubscription(subscription);
      } else {
        const subscription = this.api.addPlaceOfInterest(newPlace).subscribe((placeId) => {
          this.ngOnInit();
          this.loadingService.removeSubscription(subscription);
        });
        this.loadingService.addSubscription(subscription);
      }
    });
    if (newPlace.img instanceof File) {
      this.loadingService.addSubscription(uploadSubscription);
    }
  }

  update(place: PlaceOfInterest, link: HTMLSpanElement){
    this.place = place;
    this.placeForm.patchValue({
      rating: place.rating,
      name: place.name.ru,
      name_eng: place.name.en,
      description: place.description.ru,
      description_eng: place.description.en,
      road: place.description.ru,
      road_eng: place.description.en,
      img: place.img
    });
    console.log(link)
    link.scrollIntoView({behavior: 'smooth'});
  }

  cancel(){
    this.place = null;
    this.placeForm.reset();
  }

  remove(){
    if(!this.place){
      return;
    }
    if(confirm('Удалить достопримечательность?')){
      this.api.deletePlaceOfInterest(this.place.id, this.place.img).subscribe(() => {
        this.ngOnInit();
      })
    }
  }

  
  uploadPlaceImg(img): Observable<string> {
    if (img instanceof File) {
      const formData = new FormData();
      formData.append('PlaceImage', img, img.name.replace(' ', '_'));
      return this.api.uploadPlaceImg(formData);
    } else {
      return of(img);
    }
  }

  removeImg() {
    this.placeForm.get('img').setValue(null);
  }

  isUploadFileShown() {
    const value = this.placeForm.get('img').value;

    return !value || value instanceof File;
  }

}
