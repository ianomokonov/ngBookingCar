import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SearchModel } from './search.service';
import { NgbDate, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { Place } from '../models/place';
import { Order, UpdateOrder } from '../models/order';
import { tap } from 'rxjs/internal/operators';
import { User } from '../models/user';

@Injectable()
export class ApiService {
  private baseUrl: string = `http://localhost/booking/controller.php`;
  constructor(private http: HttpClient) {}

  /** Проверка доступа админа */
  public checkAccess(): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}?key=get-access`);
  }

  public enter(userData): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}?key=sign-in`, userData);
  }

  public signUp(userData): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}?key=sign-up`, userData);
  }

  public getUserInfo(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}?key=get-user-info`);
  }

  public editUser(user: User): Observable<boolean> {
    return this.http.post<boolean>(`${this.baseUrl}?key=update-user-info`, user);
  }

  public getCars(model?: SearchModel, limit?: number): Observable<any> {
    const url = new URL(this.baseUrl);
    url.searchParams.set('key', 'get-cars');
    if (model) {
      if (model.period) {
        url.searchParams.set('dateFrom', this.ngbDateToString(model.period.fromDate));
        if (model.period.toDate) {
          url.searchParams.set('dateTo', this.ngbDateToString(model.period.toDate));
        }
      }
      if (model.price) {
        url.searchParams.set('priceFrom', model.price.from.toString());
        url.searchParams.set('priceTo', model.price.to.toString());
      }
    }
    if (limit) {
      url.searchParams.set('limit', limit.toString());
    }
    return this.http.get<any>(url.href);
  }

  public getCar(carId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}?key=get-car&carId=${carId}`);
  }

  public uploadCarImg(data): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}?key=upload-car-img`, data);
  }

  public addCar(data): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}?key=add-car`, data);
  }

  public updateCar(data): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}?key=update-car`, data);
  }

  public getPlaces(): Observable<Place[]> {
    return this.http.get<Place[]>(`${this.baseUrl}?key=get-places`);
  }

  public addPlace(data): Observable<number> {
    return this.http.post<number>(`${this.baseUrl}?key=add-place`, data);
  }

  public updatePlace(data): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}?key=update-place`, data);
  }

  public deletePlace(id): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}?key=delete-place&placeId=${id}`);
  }

  public addOrder(order: Order): Observable<any> {
    order.dateFrom = this.ngbDateToString(order.dateFrom as NgbDate);
    order.dateTo = order.dateTo ? this.ngbDateToString(order.dateTo as NgbDate) : null;
    order.time = this.ngbTimeToString(order.time as NgbTimeStruct);
    return this.http.post<any>(`${this.baseUrl}?key=add-order`, order);
  }

  public updateOrder(order: UpdateOrder): Observable<any> {
    order.dateFrom = this.ngbDateToString(order.dateFrom as NgbDate);
    order.dateTo = order.dateTo ? this.ngbDateToString(order.dateTo as NgbDate) : null;
    order.time = this.ngbTimeToString(order.time as NgbTimeStruct);
    return this.http.post<any>(`${this.baseUrl}?key=update-order`, order);
  }

  public getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}?key=get-history`).pipe(
      tap((orders) => {
        orders.forEach((order) => {
          order.dateFrom = this.stringToNgbDate(order.dateFrom as string);
          order.dateTo = order.dateTo ? this.stringToNgbDate(order.dateTo as string) : null;
          order.time = this.stringToNgbTime(order.time as string);
        });
      })
    );
  }

  private ngbDateToString(date: NgbDate): string {
    const newDate = new Date(date.year, date.month - 1, date.day);
    const [year, month, day] = [newDate.getFullYear(), newDate.getMonth() + 1, newDate.getDate()];
    return `${ year< 10 ? `0${year}` : year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`;
  }

  private stringToNgbDate(date: string): NgbDate {
    const newDate = date.split('-');
    return NgbDate.from({ year: +newDate[0], month: +newDate[1], day: +newDate[2] });
  }

  private ngbTimeToString(time: NgbTimeStruct): string {
    return `${time.hour < 10 ? `0${time.hour}` : time.hour}:${time.minute < 10 ? `0${time.minute}` : time.minute}`;
  }

  private stringToNgbTime(time: string): NgbTimeStruct {
    const newTime = time.split(':');
    return {hour: +newTime[0], minute: +newTime[1], second: 0};
  }
}
