import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Place } from '../profile/profile-details/places/place/place.component';
import { SearchModel } from './search.service';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class ApiService {
  private baseUrl: string = `http://nomokonov.mv/booking/controller.php`;
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

  private ngbDateToString(date: NgbDate): string {
    const newDate = new Date(date.year, date.month, date.day);
    return newDate.toLocaleDateString();
  }
}
