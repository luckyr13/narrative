import { Component, OnInit } from '@angular/core';
import { AppSettingsService } from '../../core/services/app-settings.service';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss']
})
export class ApplicationComponent implements OnInit {
  appName = '';
  appVersion = '';
  protocolVersion = '';

  constructor(
    private _appSettings: AppSettingsService) {
    this.appName = this._appSettings.appName;
    this.appVersion = this._appSettings.appVersion;
    this.protocolVersion = this._appSettings.protocolVersion;
  }

  ngOnInit(): void {
    
  }

}