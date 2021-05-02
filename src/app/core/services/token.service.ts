import { Injectable } from '@angular/core';
import { DataManagerService } from './data-manager.service';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private readonly AUTH_DATA = 'auth-data';
  private readonly AUTH_TOKEN = 'auth-token';

  constructor(private _dataManager: DataManagerService) { }

  saveAuthData(data: any) {
    this._dataManager.saveInSession(this.AUTH_DATA, data);
    this.saveToken(data?.token);
  }

  getAuthData(): any {
    return this._dataManager.getFromSession(this.AUTH_DATA);
  }

  clearAuthData() {
    this.clearToken();
    this._dataManager.deleteFromSession(this.AUTH_DATA);
  }

  saveToken(token: string) {
    this._dataManager.saveInSession(this.AUTH_TOKEN, token);
  }

  getToken(): string {
    return this._dataManager.getFromSession(this.AUTH_TOKEN)?.toString();
  }

  clearToken() {
    this._dataManager.deleteFromSession(this.AUTH_TOKEN);
  }
}
