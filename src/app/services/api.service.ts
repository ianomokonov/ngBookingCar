import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SearchModel } from './search.service';
import { NgbDate, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { Place } from '../models/place';
import { Order, UpdateOrder, DateRange, OrderStatus } from '../models/order';
import { tap } from 'rxjs/internal/operators';
import { User } from '../models/user';
import { environment } from 'src/environments/environment.prod';
import { SliderRange } from '../utils/double-slider/double-slider.component';
import { Filter } from '../search/search-cars/search-cars.component';
import { PlaceOfInterest } from '../models/place-of-interest';
import { Feedback } from '../models/feedback';
import { Slide } from '../models/slide';
import { Location, LocationShort } from '../models/location';
// import { environment } from 'src/environments/environment';

@Injectable()
export class ApiService {
  private baseUrl: string = environment.baseUrl;
  constructor(private http: HttpClient) {}

  /** Проверка доступа админа */
  public checkAccess(): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}?key=check-admin`);
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

  public getPriceRange(): Observable<SliderRange> {
    return this.http.get<SliderRange>(`${this.baseUrl}?key=get-price-range`);
  }

  public editUser(user: User): Observable<boolean> {
    return this.http.post<boolean>(`${this.baseUrl}?key=update-user-info`, user);
  }

  public getCars(model?: SearchModel, limit?: number): Observable<any> {
    const url = new URL(this.baseUrl);
    url.searchParams.set('key', 'get-cars');
    if (model) {
      // if (model.dateFrom) {
      //   url.searchParams.set('dateFrom', this.ngbDateToString(model.dateFrom));
      // }
      // if (model.dateTo) {
      //   url.searchParams.set('dateTo', this.ngbDateToString(model.dateTo));
      // }
      if (model.filters) {
        model.filters.forEach((f) => {
          const options = f.options.map((o) => o.name).join(',');
          url.searchParams.append(f.prop, options);
        });
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

  public getFeedbacks(): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(`${this.baseUrl}?key=get-feedbacks`);
  }

  public addFeedback(item): Observable<boolean> {
    return this.http.post<boolean>(`${this.baseUrl}?key=add-feedback`, item);
  }

  public removeFeedback(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.baseUrl}?key=remove-feedback&id=${id}`);
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

  public addPlaceOfInterest(data): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}?key=add-place-of-interest`, data);
  }

  public updatePlaceOfInterest(data): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}?key=update-place-of-interest`, data);
  }

  public deletePlaceOfInterest(id, img): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}?key=delete-place-of-interest&placeId=${id}`, { img });
  }

  public getPlacesOfInterest(): Observable<PlaceOfInterest[]> {
    return this.http.get<PlaceOfInterest[]>(`${this.baseUrl}?key=get-places-of-interest`);
  }

  public getSlides(): Observable<Slide[]> {
    return this.http.get<Slide[]>(`${this.baseUrl}?key=get-slides`);
  }

  public addSlide(data): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}?key=add-slide`, data);
  }

  public updateSlide(data): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}?key=update-slide`, data);
  }

  public deleteSLide(id, img): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}?key=delete-slide&placeId=${id}`, { img });
  }

  public uploadPlaceImg(data): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}?key=upload-place-img`, data);
  }

  public uploadSlideImg(data): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}?key=upload-slide-img`, data);
  }

  public getPlaces(): Observable<Place[]> {
    return this.http.get<Place[]>(`${this.baseUrl}?key=get-places`);
  }

  public getFilters(): Observable<Filter[]> {
    return this.http.get<Filter[]>(`${this.baseUrl}?key=get-filters`);
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

  public addOrder(order: Order, lang: string): Observable<any> {
    order.dateFrom = this.ngbDateToString(order.dateFrom as NgbDate);
    order.dateTo = order.dateTo ? this.ngbDateToString(order.dateTo as NgbDate) : null;
    return this.http.post<any>(`${this.baseUrl}?key=add-order&lang=${lang}`, order);
  }

  public updateOrder(order: UpdateOrder): Observable<any> {
    if (order.dateFrom) {
      order.dateFrom = this.ngbDateToString(order.dateFrom as NgbDate);
    }
    if (order.dateTo) {
      order.dateTo = order.dateTo ? this.ngbDateToString(order.dateTo as NgbDate) : null;
    }
    return this.http.post<any>(`${this.baseUrl}?key=update-order`, order);
  }

  public cancelOrder(orderId: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}?key=cancel-order&orderId=${orderId}`);
  }

  public getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}?key=get-history`).pipe(
      tap((orders) => {
        orders.forEach((order) => {
          order.dateFrom = this.stringToNgbDate(order.dateFrom as string);
          order.dateTo = order.dateTo ? this.stringToNgbDate(order.dateTo as string) : null;
          order.car.dates.forEach((range) => {
            range.dateFrom = this.stringToNgbDate(range.dateFrom as any);
            range.dateTo = order.dateTo ? this.stringToNgbDate(range.dateTo as any) : null;
          });
        });
      })
    );
  }

  public getCarDates(carId: number): Observable<DateRange[]> {
    return this.http.get<DateRange[]>(`${this.baseUrl}?key=get-car-dates&carId=${carId}`).pipe(
      tap((orders) => {
        orders.forEach((order) => {
          order.dateFrom = this.stringToNgbDate(order.dateFrom as any);
          order.dateTo = order.dateTo ? this.stringToNgbDate(order.dateTo as any) : null;
        });
      })
    );
  }

  public getLocation(path: string): Observable<Location> {
    return this.http.get<Location>(`${this.baseUrl}?key=get-location&path=${path}`);
  }

  public getLocations(): Observable<LocationShort[]> {
    return this.http.get<LocationShort[]>(`${this.baseUrl}?key=get-locations`);
  }

  public uploadLocationImg(data): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}?key=upload-section-img`, data);
  }

  public updateLocation(id, data): Observable<Location> {
    return this.http.post<Location>(`${this.baseUrl}?key=update-location&id=${id}`, data);
  }

  public updateSectionImg(sectionId, data): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}?key=update-section-img&sectionId=${sectionId}`, data);
  }

  private ngbDateToString(date: NgbDate): string {
    if (!date) {
      return null;
    }
    const newDate = new Date(date.year, date.month - 1, date.day);
    const [year, month, day] = [newDate.getFullYear(), newDate.getMonth() + 1, newDate.getDate()];
    return `${year < 10 ? `0${year}` : year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`;
  }

  private stringToNgbDate(date: string): NgbDate {
    if (!date) {
      return null;
    }
    const newDate = date.split('-');
    return NgbDate.from({ year: +newDate[0], month: +newDate[1], day: +newDate[2] });
  }

  public ngbTimeToString(time: NgbTimeStruct): string {
    return `${time.hour < 10 ? `0${time.hour}` : time.hour}:${time.minute < 10 ? `0${time.minute}` : time.minute}`;
  }

  private stringToNgbTime(time: string): NgbTimeStruct {
    const newTime = time.split(':');
    return { hour: +newTime[0], minute: +newTime[1], second: 0 };
  }
}
