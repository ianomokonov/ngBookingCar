import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-enter',
  templateUrl: './enter.component.html',
  styleUrls: ['./enter.component.scss'],
})
export class EnterComponent implements OnInit {
  public enterForm: FormGroup;
  public showError: boolean;
  constructor( private auth: AuthService, private api: ApiService, private router: Router, private fb: FormBuilder) {
    this.enterForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    // this.api.checkAccess().subscribe(isAdmin => {
    //   if(isAdmin){
    //     this.router.navigate(['/admin']);
    //     return;
    //   }
    //   this.show = true;
    //   sessionStorage.removeItem('');
    // },
    // error => {
    //   this.show = true;
    // })
  }

  public onEnterClick(): void {
    this.showError = false;
    if (this.enterForm.invalid) {
      for (let value of Object.values(this.enterForm.controls)) {
        if (value.invalid) {
          value.markAsDirty();
        }
      }
      return;
    }
    this.api.enter(this.enterForm.getRawValue()).subscribe(
      (token) => {

        if (token) {
          this.auth.setToken(token);
          this.router.navigate([this.auth.redirectUrl]);
        } else {
          this.showError = true;
        }

      },
      (error) => {
        console.log(error);
      }
    );
  }

  public onBackClick(): void {
    window.history.back();
  }
}
