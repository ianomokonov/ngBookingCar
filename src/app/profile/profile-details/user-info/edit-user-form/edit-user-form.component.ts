import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/models/user';

@Component({
  selector: 'bk-edit-user-form',
  templateUrl: './edit-user-form.component.html',
  styleUrls: ['./edit-user-form.component.scss']
})
export class EditUserFormComponent implements OnInit {
  userForm: FormGroup;
  public set user(user: User){
    this.userForm.patchValue(user);
  }
  constructor(private fb: FormBuilder, public modal: NgbActiveModal) {
    this.userForm = this.fb.group({
      name: null,
      surname: null,
      middlename: null,
      email: null,
      phone: null,
    })
   }

  ngOnInit(): void {
  }

  save(){
    this.modal.close(this.userForm.getRawValue());
  }

}
