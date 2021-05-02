import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  // tslint:disable-next-line: trailing-comma
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private jwtToken: string;
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(): boolean {
    const tokenValid = this.authService.isAuthenticated();
    if (tokenValid) {
      return true;
    } else {
      this.router.navigate(['auth/login']);
      return false;
    }
  }

  getToken() {
    return this.jwtToken;
  }
}
