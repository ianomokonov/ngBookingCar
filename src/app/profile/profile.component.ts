import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'bk-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  public links = [
    { title: 'История заказов', fragment: 'history' },
    { title: 'Автомобили', fragment: 'cars' },
  ];
  constructor(public route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
  }

  public getActive(){
    return this.route.firstChild ? this.route.firstChild.url['value'][0].path : '';
  }
}
