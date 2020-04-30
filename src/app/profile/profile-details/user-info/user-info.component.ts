import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditUserFormComponent } from './edit-user-form/edit-user-form.component';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { User } from 'src/app/models/user';
import { takeWhile } from 'rxjs/internal/operators';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'bk-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss'],
})
export class UserInfoComponent implements OnInit {
  public userInfo: User;
  private rxAlive: boolean = true;
  constructor(private modalService: NgbModal, private auth: AuthService, private router: Router, private api: ApiService, private loadingService: LoadingService,) {}

  public ngOnInit(): void {
    this.getUser();
  }

  public edit() {
    const modal = this.modalService.open(EditUserFormComponent);
    modal.componentInstance.user = this.userInfo;
    modal.result
      .then((user) => {
        this.api
          .editUser(user)
          .pipe(takeWhile(() => this.rxAlive))
          .subscribe(() => {
            this.getUser();
          });
      })
      .catch(() => {});
  }

  private getUser() {
    const subscription = this.api.getUserInfo().subscribe((info) => {
      this.userInfo = info;
      this.loadingService.removeSubscription(subscription);
    });
    this.loadingService.addSubscription(subscription);
  }

  public exit() {
    this.auth.exit();
    this.router.navigate(['/enter']);
  }
}
