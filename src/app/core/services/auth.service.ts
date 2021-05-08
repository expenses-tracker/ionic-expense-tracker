import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';

import { UserDetails } from '../models/userdetails.model';
import { LoginData } from '../models/login.model';

import { ExpenseUtilService } from '../utils/expense-util.service';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private token: TokenService) { }

  getUrl(routeArg: string) {
    return ExpenseUtilService.getUrl(routeArg);
  }

  isAuthenticated() {
    return this.token.getToken()?.length > 0;
  }

  login(data: LoginData) {
    return this.http.post(this.getUrl('login'), data)
    .pipe(
      tap((authData) => this.token.saveAuthData(authData))
    );
  }

  logout(data: any) {
    return this.http.post(this.getUrl('logout'), data)
    .pipe(
      tap(() => this.token.clearAuthData())
    );
  }

  register(userDetails: UserDetails) {
    return this.http.post(this.getUrl('register'), userDetails);
  }

  clearAuthData() {
    this.token.clearAuthData();
  }
}
