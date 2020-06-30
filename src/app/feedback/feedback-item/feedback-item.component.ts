import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'bk-feedback-item',
  templateUrl: './feedback-item.component.html',
  styleUrls: ['./feedback-item.component.scss']
})
export class FeedbackItemComponent implements OnInit {
  public date = new Date();
  items = [
    {
      name: 'Иван ИВанов',
      car: {
        id: 1,
        name: "sfdfdsdfsdf",
        img: "http://client.nomokoiw.beget.tech/booking/Files/5ed0f3b4de587_Matiz.jpg"
      },
      message: "assssssssssssssssssssssssssssss adssssssssss asddddddddddddddddddas dddddddddddddd",
      raiting: 4.5,
      date: new Date()
    },
    {
      name: 'Иван ИВанов',
      car: {
        id: 4,
        name: "sfdfdsdfsdf",
        img: "http://client.nomokoiw.beget.tech/booking/Files/5ed0f4402ead3_Spark.jpg"
      },
      message: "assssssssssssssssssssssssssssss adssssssssss asddddddddddddddddddas dddddddddddddd",
      raiting: 4.5,
      date: new Date()
    },
    {
      name: 'Иван ИВанов',
      car: {
        id: 3,
        name: "sfdfdsdfsdf",
        img: "http://client.nomokoiw.beget.tech/booking/Files/5ed0f3b4de587_Matiz.jpg"
      },
      message: "assssssssssssssssssssssssssssss adssssssssss asddddddddddddddddddas dddddddddddddd",
      raiting: 4.5,
      date: new Date()
    },
  ]
  constructor(public translate: TranslateService) { }

  ngOnInit(): void {
  }

}
