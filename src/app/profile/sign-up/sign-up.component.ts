import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'bk-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  public userForm: FormGroup;

  constructor(private fb: FormBuilder, private api: ApiService, private auth: AuthService, private router: Router ) {
    this.userForm = this.fb.group({
      name: [null, Validators.required],
      surname: [null, Validators.required],
      middlename: null,
      email: [null, [Validators.required, Validators.email]],
      phone: null,
      password: [null, Validators.required]
    });
  }

  ngOnInit(): void {}

  public onSignUpClick() {
    if(this.userForm.invalid) {
      for (let value of Object.values(this.userForm.controls)) {
        if (value.invalid) {
          value.markAsDirty();
        }
      }
      return;
    }

    this.api.signUp(this.userForm.getRawValue()).subscribe(token => {
      this.auth.setToken(token);
      this.router.navigate(['/profile', token]);
    })

  }
}
