import { Injectable } from '@angular/core';
import { Observable, from, map } from 'rxjs';
import { UserAuthService } from './user-auth.service';
import { AppSettingsService } from './app-settings.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private _notifications: Record<string, Record<string, 'pending'|'invalid-hash'|'not-found'|'mined'>> = {};

  constructor(
    private _userAuth: UserAuthService,
    private _appSettings: AppSettingsService) {
  }

  addPendingTx(owner: string, txId: string): void {
    if (!Object.prototype.hasOwnProperty.call(this._notifications[owner], txId)) {
      this._notifications[owner] = {};
    }
    this._notifications[owner][txId] = 'pending';    
  }



}
