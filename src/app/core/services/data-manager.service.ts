import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataManagerService {

  constructor() { }

  saveInSession(name: string, data: Object): void {
    sessionStorage.setItem(name, JSON.stringify(data));
  }

  deleteFromSession(name: string): void {
    sessionStorage.removeItem(name);
  }

  getFromSession(name: string): Object {
    return JSON.parse(sessionStorage.getItem(name));
  }

  clearAllSession() {
    sessionStorage.clear();
  }

  saveInLocal(name: string, data: Object): void {
    localStorage.setItem(name, JSON.stringify(data));
  }

  deleteFromLocal(name: string): void {
    localStorage.removeItem(name);
  }

  getFromLocal(name: string): Object {
    return JSON.parse(sessionStorage.getItem(name));
  }

  clearAllLocal() {
    localStorage.clear();
  }
}
