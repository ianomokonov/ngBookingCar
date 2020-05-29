import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/models/user';

// @Component({
//   selector: 'bk-edit-user-form',
//   templateUrl: './edit-user-form.component.html',
//   styleUrls: ['./edit-user-form.component.scss'],
// })
export class EditUserFormComponent implements OnInit {
  userForm: FormGroup;
  public set user(user: User) {
    this.userForm.patchValue(user);
  }
  constructor(private fb: FormBuilder, public modal: NgbActiveModal) {
    this.userForm = this.fb.group({
      name: [null, Validators.required],
      surname: [null, Validators.required],
      middlename: null,
      phone: [null, Validators.pattern(/^\d{11}$/)],
    });
  }

  ngOnInit(): void {}

  save() {
    if (this.userForm.invalid) {
      for (const value of Object.values(this.userForm.controls)) {
        if (value.invalid) {
          value.markAsDirty();
        }
      }
      return;
    }
    this.modal.close(this.userForm.getRawValue());
  }
}
