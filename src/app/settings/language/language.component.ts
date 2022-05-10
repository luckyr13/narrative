import { Component, OnInit } from '@angular/core';
import { UserSettingsService } from '../../core/services/user-settings.service';

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss']
})
export class LanguageComponent implements OnInit {
  currentLang: string;

  constructor(private _userSettings: UserSettingsService) {
    this.currentLang = this._userSettings.getDefaultLang();
  }

  ngOnInit(): void {
  }

}
