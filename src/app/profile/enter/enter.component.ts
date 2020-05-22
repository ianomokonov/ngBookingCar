import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ApiService } from 'src/app/services/api.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'bk-enter',
  templateUrl: './enter.component.html',
  styleUrls: ['./enter.component.scss'],
})
export class EnterComponent implements OnInit {
  public enterForm: FormGroup;
  public showError: boolean;
  constructor(
    private auth: AuthService,
    private api: ApiService,
    private loadingService: LoadingService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.enterForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {}

  public onEnterClick(): void {
    this.showError = false;
    if (this.enterForm.invalid) {
      for (const value of Object.values(this.enterForm.controls)) {
        if (value.invalid) {
          value.markAsDirty();
        }
      }
      return;
    }
    const subscription = this.api.enter(this.enterForm.getRawValue()).subscribe(
      (token) => {
        if (token) {
          this.auth.setToken(token);
          this.router.navigate([this.auth.redirectUrl]);
        } else {
          this.showError = true;
        }
        this.loadingService.removeSubscription(subscription);
      },
      (error) => {
        console.log(error);
        this.loadingService.removeSubscription(subscription);
      }
    );
    this.loadingService.addSubscription(subscription);
  }

  public onBackClick(): void {
    window.history.back();
  }
}
