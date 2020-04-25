import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class AuthService{
    private token: string;
    private readonly KEY = 'bookingUserToken';

    constructor(){
        this.token = sessionStorage.getItem('bookingUserToken');
    }

    public setToken(token: string): void{
        this.token = token;
        sessionStorage.setItem(this.KEY, token);
    }

    public getToken(): string {
        return this.token;
    }

    public exit(){
        this.token = null;
        sessionStorage.removeItem(this.KEY);
    }
}