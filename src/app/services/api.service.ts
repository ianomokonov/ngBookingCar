import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Place } from '../profile/profile-details/places/place/place.component';

@Injectable()
export class ApiService {
  private baseUrl: string = `http://nomokonov.mv/booking/controller.php?`;
  constructor(private http: HttpClient) {}

  /** Проверка доступа админа */
  public checkAccess(): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}key=get-access`);
  }

  public enter(userData): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}key=sign-in`, userData);
  }

  public signUp(userData): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}key=sign-up`, userData);
  }

  public getUserInfo(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}key=get-user-info`);
  }

  public getCars(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}key=get-cars`);
  }

  public getCar(carId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}key=get-car&carId=${carId}`);
  }

  public uploadCarImg(data): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}key=upload-car-img`, data);
  }

  public addCar(data): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}key=add-car`, data);
  }

  public updateCar(data): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}key=update-car`, data);
  }

  public getPlaces(): Observable<Place[]> {
    return this.http.get<Place[]>(`${this.baseUrl}key=get-places`);
  }

  public addPlace(data): Observable<number> {
    return this.http.post<number>(`${this.baseUrl}key=add-place`, data);
  }

  public updatePlace(data): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}key=update-place`, data);
  }

  public deletePlace(id): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}key=delete-place&placeId=${id}`);
  }

  // //Гость

  // /** Получение информыции о госте */
  // public getGuestInfo(): Observable<Guest>{
  //     return this.http.get<Guest>(`${this.baseUrl}key=get-guest-info`);
  // }

  // /** Подтверждение возможности гостя прити на свадьбу */
  // public ApproveComming(approved: boolean): Observable<Message>{
  //     return this.http.post<Message>(`${this.baseUrl}key=approve-comming`, {approved});
  // }

  // /** Сохранение ответов на вопросы */
  // public SaveAnswer(answer: SaveAnswerRequest): Observable<Guest>{
  //     return this.http.post<Guest>(`${this.baseUrl}key=save-answer`, answer);
  // }

  // //Админ

  // public enter(login: string, password: string): Observable<string>{
  //     return this.http.post<string>(`${this.baseEnterUrl}`, {login, password});
  // }

  // /** получение списка гостей */
  // public getGuests(): Observable<Guest[]>{
  //     return this.http.get<Guest[]>(`${this.baseUrl}key=get-guests`);
  // }

  // /** Получение информации гостя по id
  //  * @returns информация гостя
  // */
  // public GetGuestInfoById(guestId: number): Observable<Guest>{
  //     return this.http.get<Guest>(`${this.baseUrl}key=get-guest-info-by-id&guestId=${guestId}`);
  // }

  // /** Создание гостя
  //  * @returns id нового гостя
  //  */
  // public CreateGuest(guest: Guest): Observable<number>{
  //     return this.http.post<number>(`${this.baseUrl}key=create-guest`, guest);
  // }

  // /** Обновление информации гостя */
  // public UpdateGuest(guest: any): Observable<Message>{
  //     return this.http.post<Message>(`${this.baseUrl}key=update-guest`, guest);
  // }

  // /** Создание ссылки гостя */
  // public GenerateLink(link: GenerateLinkRequest): Observable<Link>{
  //     return this.http.post<Link>(`${this.baseUrl}key=generate-link`, link);
  // }

  // /** Добавление гостя в ссылку */
  // public AddToLink(link: UpdateLinkRequest): Observable<Message>{
  //     return this.http.post<Message>(`${this.baseUrl}key=add-to-link`, link);
  // }

  // /** Удаление гостя из ссылки */
  // public RemoveFromLink(link: UpdateLinkRequest): Observable<Message>{
  //     return this.http.post<Message>(`${this.baseUrl}key=remove-from-link`, link);
  // }

  // /** Получение статистики опроса */
  // public GetStatistics(){
  //     return this.http.get(`${this.baseUrl}key=get-questioning-results`);
  // }

  // /** Получение результатов опроса */
  // public GetQuestioningResults(){
  //     return this.http.get(`${this.baseUrl}key=Ключ запроса не найден`);
  // }
}
