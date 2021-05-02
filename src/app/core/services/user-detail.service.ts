import { Injectable } from '@angular/core';
import { UserData, UserDetails } from '../data/users';
import { tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserDetailService {

  private user: UserDetails;

  constructor(private userService: UserData) { }

  currentUser() {
    return this.user;
  }

  fetchUserDetail() {
    return this.userService.getUsers().pipe(map((user) => {
      this.user = user;
      return user;
    }));
  }

  logout() {
    return this.userService.logout();
  }
}
