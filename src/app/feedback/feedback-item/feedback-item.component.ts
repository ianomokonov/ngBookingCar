import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Feedback } from 'src/app/models/feedback';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'bk-feedback-item',
  templateUrl: './feedback-item.component.html',
  styleUrls: ['./feedback-item.component.scss'],
})
export class FeedbackItemComponent implements OnInit {
  public date = new Date();
  @Input() public item: Feedback;
  @Input() public isAdmin: boolean;
  @Output() public itemChanged = new EventEmitter();
  constructor(public translate: TranslateService, private api: ApiService) {}

  ngOnInit(): void {}

  removeItem() {
    if (!confirm('Вы уверены, что хотите удалить отзыв?')) {
      return;
    }
    this.api.removeFeedback(this.item.id).subscribe(() => {
      this.itemChanged.emit();
    });
  }
}
