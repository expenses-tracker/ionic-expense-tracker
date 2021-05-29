import { Injectable } from '@angular/core';
import { map, take, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

import { UserDetails } from '../models/userdetails.model';
import { IPhoto } from '../../shared/models/photo.model';

import { AbstractHttpService } from './http/abstract-http.service';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class UserDetailService {

  private userData: UserDetails;

  constructor(private http: AbstractHttpService, private tokenService: TokenService) { }

  get url() {
    return `${environment.service.domain}${environment.service.endpoints.user}`;
  }

  currentUser() {
    if (!this.userData) {
      this.userData = JSON.parse(this.tokenService.getAuthData());
    }
    return this.userData;
  }

  currentUser$() {
    return this.getUserData(this.userData.email);
  }

  getUserData(id: string) {
    const url = `${this.url}email/${id}`;
    return this.http.get(url).pipe(
      take(1),
      map((user: UserDetails[]) => {
        this.userData = user.length > 0 ? user[0] : null;
        return this.userData;
      })
    );
  }

  updatePhoto(data: IPhoto) {
    this.userData.photo = data;
    const url = `${this.url}${this.userData._id}`;
    return this.http.put(url, this.userData).pipe(
      map((user: UserDetails[]) => {
        this.userData = user.length > 0 ? user[0] : null;
        return this.userData;
      })
    );
  }
}
