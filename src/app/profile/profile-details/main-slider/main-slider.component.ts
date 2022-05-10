import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { Slide } from 'src/app/models/slide';
import { ApiService } from 'src/app/services/api.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'bk-main-slider',
  templateUrl: './main-slider.component.html',
  styleUrls: ['./main-slider.component.scss'],
})
export class MainSliderComponent implements OnInit {
  public sliderForm: FormGroup;
  public slides = [];
  public slide;
  constructor(private fb: FormBuilder, private api: ApiService, private loadingService: LoadingService) {
    this.sliderForm = fb.group({
      img: [null, Validators.required],
      title: [null, Validators.required],
      title_eng: [null, Validators.required],
      title_de: [null, Validators.required],
      description: [null, Validators.required],
      description_eng: [null, Validators.required],
      description_de: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.slide = null;
    this.sliderForm.reset();
    const subscription = this.api.getSlides().subscribe(
      (slides) => {
        this.loadingService.removeSubscription(subscription);
        if (slides['message']) {
          return;
        }
        this.slides = slides || [];
      },
      () => {
        this.loadingService.removeSubscription(subscription);
      }
    );
    this.loadingService.addSubscription(subscription);
  }

  public saveSlide() {
    if (this.sliderForm.invalid) {
      for (const control of Object.values(this.sliderForm.controls)) {
        if (control.invalid) {
          control.markAsDirty();
        }
      }
      return;
    }
    const newPlace = this.sliderForm.getRawValue();
    const uploadSubscription = this.uploadPlaceImg(newPlace.img).subscribe((data) => {
      if (newPlace.img instanceof File) {
        this.loadingService.removeSubscription(uploadSubscription);
      }
      newPlace.img = data;
      if (this.slide) {
        newPlace.id = this.slide.id;
        newPlace.oldImg = this.slide.img;
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

  update(slide: Slide, link: HTMLSpanElement) {
    this.slide = slide;
    this.sliderForm.patchValue({
      title: slide.title.ru,
      title_eng: slide.title.en,
      title_de: slide.title.de,
      description: slide.description.ru,
      description_eng: slide.description.en,
      description_de: slide.description.de,
      img: slide.img,
    });
    console.log(link);
    link.scrollIntoView({ behavior: 'smooth' });
  }

  cancel() {
    this.slide = null;
    this.sliderForm.reset();
  }

  remove() {
    if (!this.slide) {
      return;
    }
    if (confirm('Удалить достопримечательность?')) {
      this.api.deletePlaceOfInterest(this.slide.id, this.slide.img).subscribe(() => {
        this.ngOnInit();
      });
    }
  }

  uploadPlaceImg(img): Observable<string> {
    if (img instanceof File) {
      const formData = new FormData();
      formData.append('SlideImage', img, img.name.replace(' ', '_'));
      return this.api.uploadSlideImg(formData);
    } else {
      return of(img);
    }
  }

  removeImg() {
    this.sliderForm.get('img').setValue(null);
  }

  isUploadFileShown() {
    const value = this.sliderForm.get('img').value;

    return !value || value instanceof File;
  }
}
