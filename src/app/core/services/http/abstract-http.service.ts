import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenService } from '../token.service';

@Injectable({
  // tslint:disable-next-line: trailing-comma
  providedIn: 'root'
})
export class AbstractHttpService {

  constructor(
    private _http: HttpClient, private _token: TokenService) { }

  private getToken() {
    return this._token.getToken();
  }

  private defaultHeaders() {
    return new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });
  }

  get(url: string) {
    return this._http.get(url, {
      // tslint:disable-next-line: trailing-comma
      headers: this.defaultHeaders()
    });
  }

  post(url: string, body: Object) {
    return this._http.post(url, body, {
      // tslint:disable-next-line: trailing-comma
      headers: this.defaultHeaders()
    });
  }

  put(url: string, body: Object) {
    return this._http.put(url, body, {
      // tslint:disable-next-line: trailing-comma
      headers: this.defaultHeaders()
    });
  }

  delete(url: string) {
    return this._http.delete(url, {
      // tslint:disable-next-line: trailing-comma
      headers: this.defaultHeaders()
    });
  }
}
