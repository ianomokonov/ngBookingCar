import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditUserFormComponent } from './edit-user-form/edit-user-form.component';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'bk-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss'],
})
export class UserInfoComponent implements OnInit {
  public userInfo = {
    name: 'Иван',
    surname: 'Номоконов',
    secondname: 'Александрович',
    email: 'nomokonov.vana@yandex.ru',
    phone: '89151999845',
  };
  constructor(private modalService: NgbModal, private auth: AuthService, private router: Router) {}

  public ngOnInit(): void {}

  public edit(){
    this.modalService.open(EditUserFormComponent)
  }

  public exit(){
    this.auth.exit();
    this.router.navigate(['/enter'])
  }
}
