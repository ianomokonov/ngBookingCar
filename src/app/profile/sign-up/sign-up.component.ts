import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { LoadingService } from 'src/app/services/loading.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'bk-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  public userForm: FormGroup;
  public showError: boolean;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private loadingService: LoadingService,
    private auth: AuthService,
    private router: Router,
    public translate: TranslateService
  ) {
    this.userForm = this.fb.group({
      name: [null, Validators.required],
      surname: [null, Validators.required],
      middlename: null,
      email: [null, [Validators.required, Validators.email]],
      phone: [null, Validators.pattern(/^\d{11}$/)],
      password: [null, Validators.required],
    });
  }

  ngOnInit(): void {}

  public onSignUpClick() {
    this.showError = false;
    if (this.userForm.invalid) {
      for (const value of Object.values(this.userForm.controls)) {
        if (value.invalid) {
          value.markAsDirty();
        }
      }
      return;
    }

    const subscription = this.api.signUp(this.userForm.getRawValue()).subscribe((token) => {
      if (token) {
        this.auth.setToken(token);
        this.router.navigate(['/' + this.translate.currentLang, ...this.auth.redirectUrl]);
      } else {
        this.showError = true;
      }
      this.loadingService.removeSubscription(subscription);
    });
    this.loadingService.addSubscription(subscription);
  }
}
