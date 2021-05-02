import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { LoginData } from '../models/login.model';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private _http: HttpClient, private _token: TokenService) { }

  getUrl(routeArg: string) {
    return `${environment.service.domain}${environment.service.endpoints[routeArg]}`;
  }

  isAuthenticated() {
    return this._token.getToken()?.length > 0;
  }

  login(data: LoginData) {
    return this._http.post(this.getUrl('login'), data)
    .pipe(
      tap((data) => this._token.saveAuthData(data))
    );
  }

  logout(data: any) {
    return this._http.post(this.getUrl('logout'), data)
    .pipe(
      tap(() => this._token.clearAuthData())
    );
  }

  clearAuthData() {
    this._token.clearAuthData();
  }
}
