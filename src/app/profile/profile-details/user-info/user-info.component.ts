import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditUserFormComponent } from './edit-user-form/edit-user-form.component';

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
  constructor(private modalService: NgbModal) {}

  public ngOnInit(): void {}

  public edit(){
    this.modalService.open(EditUserFormComponent)
  }
}
