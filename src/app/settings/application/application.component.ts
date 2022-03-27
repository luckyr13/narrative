import { Component, OnInit } from '@angular/core';
import { AppSettingsService } from '../../core/services/app-settings.service';
import { UserAuthService } from '../../core/services/user-auth.service';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss']
})
export class ApplicationComponent implements OnInit {
  appName = '';
  appVersion = '';
  protocolVersion = '';
  mainAddress = this._userAuth.account$;
  sessionData = this._userAuth.getSessionData();

  constructor(
    private _appSettings: AppSettingsService,
    private _userAuth: UserAuthService) {
    this.appName = this._appSettings.appName;
    this.appVersion = this._appSettings.appVersion;
    this.protocolVersion = this._appSettings.protocolVersion;
  }

  ngOnInit(): void {
    
  }

  deleteSes() {
    this._userAuth.destroySession();
  }

}
