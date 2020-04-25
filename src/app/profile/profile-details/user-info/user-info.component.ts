import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditUserFormComponent } from './edit-user-form/edit-user-form.component';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'bk-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss'],
})
export class UserInfoComponent implements OnInit {
  public userInfo;
  constructor(private modalService: NgbModal, private auth: AuthService, private router: Router, private api: ApiService) {}

  public ngOnInit(): void {
    this.api.getUserInfo().subscribe(info => {
      this.userInfo = info;
    }) 
  }

  public edit(){
    this.modalService.open(EditUserFormComponent)
  }

  public exit(){
    this.auth.exit();
    this.router.navigate(['/enter'])
  }
}
