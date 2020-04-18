import { Component, OnInit } from '@angular/core';

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
  constructor() {}

  ngOnInit(): void {}
}
