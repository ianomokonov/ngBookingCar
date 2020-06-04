import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { SessionStorageService } from '../session-storage';

@Injectable()
export class AuthService {
  private token: string;
  private readonly KEY = 'bookingUserToken';
  public redirectUrl: string[] = ['profile'];
  public $userUpdate: Subject<boolean> = new Subject();

  constructor(private ss: SessionStorageService) {
    this.token = this.ss.getItem('bookingUserToken');
  }

  public setToken(token: string): void {
    this.token = token;
    this.ss.setItem(this.KEY, token);
    if (token) {
      this.$userUpdate.next(true);
    }
  }

  public getToken(): string {
    return this.token;
  }

  public exit() {
    this.token = null;
    this.ss.removeItem(this.KEY);
    this.$userUpdate.next(false);
  }

  public setDefaultUrl() {
    this.redirectUrl = ['profile'];
  }
}
