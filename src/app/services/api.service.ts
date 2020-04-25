import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
