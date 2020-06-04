  
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServerSessionStorageService {
  private store: {[key: string]: string} = {};

  constructor() { }

  getItem(key: string): string | null {
    return this.store[key];
  }

  setItem(key: string, value: string): void {
    this.store[key] = value;
  }
}