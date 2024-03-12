import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { LoadingService } from 'src/app/services/loading.service';
import { TranslateService } from '@ngx-translate/core';
import { Location } from 'src/app/models/location';
import { ActivatedRoute } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { markInvalidFields } from 'src/app/utils/mark-invalid-fileds';
import { Observable, forkJoin, of } from 'rxjs';

@Component({
  selector: 'bk-edit-location',
  templateUrl: './edit-location.component.html',
  styleUrls: ['./edit-location.component.scss'],
})
export class EditLocationComponent implements OnInit {
  location: Location;
  locationForm: FormGroup;

  get sectionForms(): FormGroup[] {
    return (this.locationForm.get('sections') as FormArray).controls as FormGroup[];
  }
  constructor(
    private activatedRoute: ActivatedRoute,
    private api: ApiService,
    private loadingService: LoadingService,
    public translate: TranslateService,
    private fb: FormBuilder
  ) {
    this.locationForm = fb.group({
      name: [null],
      name_eng: [null, Validators.required],
      name_de: [null],
      sections: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({ location }) => {
      this.getLocation(location);
    });
  }

  getLocation(location: string): void {
    const subscription = this.api.getLocation(location).subscribe((l) => {
      this.location = l;
      this.locationForm.patchValue({
        name: l.name.ru,
        name_eng: l.name.en,
        name_de: l.name.de,
      });
      this.locationForm.setControl(
        'sections',
        this.fb.array(
          this.location.sections.map((s) =>
            this.fb.group({
              name: [s.name.ru],
              name_eng: [s.name.en, Validators.required],
              name_de: [s.name.de],
              description: [s.description.ru],
              description_eng: [s.description.en, Validators.required],
              description_de: [s.description.de],
              img: [s.img],
            })
          )
        )
      );
      this.loadingService.removeSubscription(subscription);
    });
    this.loadingService.addSubscription(subscription);
  }

  addSection() {
    const sections = this.locationForm.get('sections') as FormArray;
    sections.push(
      this.fb.group({
        name: [null],
        name_eng: [null, Validators.required],
        name_de: [null],
        description: [null],
        description_eng: [null, Validators.required],
        description_de: [null],
        img: [null],
      })
    );
  }

  removeSection(index: number) {
    const sections = this.locationForm.get('sections') as FormArray;
    sections.removeAt(index);
  }

  removeImg(section: FormGroup) {
    section.get('img').setValue(null);
  }

  isUploadFileShown(section: FormGroup) {
    const value = section.get('img').value;

    return !value || value instanceof File;
  }

  save() {
    if (this.locationForm.invalid) {
      markInvalidFields(this.locationForm);
      alert('Заполните обязательные поля');
      return;
    }
    const dto = this.locationForm.getRawValue();
    const subscription = this.api.updateLocation(this.location.id, dto).subscribe(
      (savedLocation) => {
        forkJoin(
          dto.sections.map((s, index) => {
            if (!savedLocation.sections[index]?.id) {
              return of(null);
            }
            return this.uploadImg(s.img, savedLocation.sections[index]?.id);
          })
        ).subscribe(
          () => {
            this.loadingService.removeSubscription(subscription);
          },
          () => {
            this.loadingService.removeSubscription(subscription);
          }
        );
      },
      () => {
        this.loadingService.removeSubscription(subscription);
      }
    );
    this.loadingService.addSubscription(subscription);
  }

  uploadImg(img, sectionId): Observable<string> {
    if (img instanceof File) {
      const formData = new FormData();
      formData.append('Image', img, img.name.replace(' ', '_'));
      return this.api.uploadLocationImg(sectionId, formData);
    } else if (!img) {
      return this.api.updateSectionImg(sectionId, img);
    }

    return of(img);
  }
}
