import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'bk-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  public today = new Date();

  constructor() {}

  ngOnInit(): void {}
}
