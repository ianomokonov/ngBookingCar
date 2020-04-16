import { Injectable } from '@angular/core';

@Injectable()
export class AuthService{
    private token: string;

    constructor(){
        this.token = sessionStorage.getItem('bookingUserToken');
    }

    public setToken(token: string): void{
        this.token = token;
        sessionStorage.setItem('bookingUserToken', token);
    }

    public getToken(): string {
        return this.token;
    }
}