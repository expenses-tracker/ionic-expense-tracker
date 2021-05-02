import { Injectable } from '@angular/core';
import { DataManagerService } from './data-manager.service';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private readonly authData = 'auth-data';
  private readonly authToken = 'auth-token';

  constructor(private dataManager: DataManagerService) { }

  saveAuthData(data: any) {
    this.dataManager.saveInSession(this.authData, data);
    this.saveToken(data?.token);
  }

  getAuthData(): any {
    return this.dataManager.getFromSession(this.authData);
  }

  clearAuthData() {
    this.clearToken();
    this.dataManager.deleteFromSession(this.authData);
  }

  saveToken(token: string) {
    this.dataManager.saveInSession(this.authToken, token);
  }

  getToken(): string {
    return this.dataManager.getFromSession(this.authToken)?.toString();
  }

  clearToken() {
    this.dataManager.deleteFromSession(this.authToken);
  }
}
