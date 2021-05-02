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

  constructor(private http: HttpClient, private token: TokenService) { }

  getUrl(routeArg: string) {
    return `${environment.service.domain}${environment.service.endpoints[routeArg]}`;
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

  clearAuthData() {
    this.token.clearAuthData();
  }
}
