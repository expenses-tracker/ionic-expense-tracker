import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenService } from '../token.service';

@Injectable({
  // tslint:disable-next-line: trailing-comma
  providedIn: 'root'
})
export class AbstractHttpService {

  constructor(
    private http: HttpClient, private token: TokenService) { }

  get(url: string) {
    return this.http.get(url, {
      headers: this.defaultHeaders()
    });
  }

  post(url: string, body: any) {
    return this.http.post(url, body, {
      headers: this.defaultHeaders()
    });
  }

  put(url: string, body: any) {
    return this.http.put(url, body, {
      headers: this.defaultHeaders()
    });
  }

  delete(url: string) {
    return this.http.delete(url, {
      headers: this.defaultHeaders()
    });
  }

  private getToken() {
    return this.token.getToken();
  }

  private defaultHeaders() {
    return new HttpHeaders({
      authorization: `Bearer ${this.getToken()}`,
    });
  }
}
