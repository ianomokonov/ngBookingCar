import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Feedback } from 'src/app/models/feedback';

@Component({
  selector: 'bk-feedback-item',
  templateUrl: './feedback-item.component.html',
  styleUrls: ['./feedback-item.component.scss']
})
export class FeedbackItemComponent implements OnInit {
  public date = new Date();
  @Input() public item: Feedback;
  constructor(public translate: TranslateService) { }

  ngOnInit(): void {
  }

}
