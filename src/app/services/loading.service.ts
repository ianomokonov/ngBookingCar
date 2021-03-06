import { ChangeDetectorRef, EventEmitter, Injectable } from '@angular/core';
import { Subscription } from 'rxjs';

@Injectable()
export class LoadingService {
  /** отображать возможность отмены */
  public hasCancelBtn = true;
  /** срабатывает при отмене загрузки */
  public onCancel: EventEmitter<boolean> = new EventEmitter();
  /** cdRef */
  private cdRef: ChangeDetectorRef;
  /** get isLoading */
  public get isLoading(): boolean {
    return this._isLoading;
  }
  /** идет загрузка */
  private _isLoading: boolean;
  /** текущие подписки приложения */
  private subscriptions: Subscription = new Subscription();
  /** количество активных подписок */
  private subscriptionsCount: number = 0;
  /** установить отображение кнопки отмены по умолчанию */
  public setDefaultCancelBtn(): void {
    this.hasCancelBtn = true;
  }
  /** установить отображение кнопки отмены по умолчанию */
  public set changeDetectorRef(cdr: ChangeDetectorRef) {
    this.cdRef = cdr;
  }
  /** отменить текущие загрузки */
  public cancelLoading(): void {
    if (!this.hasCancelBtn) {
      return;
    }
    this.subscriptions.unsubscribe();
    this._isLoading = false;
    this.setDefaultCancelBtn();
    this.subscriptions = new Subscription();
    this.subscriptionsCount = 0;
  }
  /** добавление подписки */
  public addSubscription(subscription: Subscription): void {
    this.subscriptionsCount++;
    this.subscriptions.add(subscription);
    this._isLoading = true;
    this.cdRef.detectChanges();
  }
  /** удаление подписки */
  public removeSubscription(subscription: Subscription): void {
    this.subscriptionsCount--;
    this.subscriptions.remove(subscription);
    if (this.subscriptionsCount === 0) {
      this._isLoading = false;
      this.cdRef.detectChanges();
    }
  }
}
