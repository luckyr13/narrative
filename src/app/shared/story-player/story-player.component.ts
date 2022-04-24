import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { UserSettingsService } from '../../core/services/user-settings.service';

@Component({
  selector: 'app-story-player',
  templateUrl: './story-player.component.html',
  styleUrls: ['./story-player.component.scss']
})
export class StoryPlayerComponent implements OnInit {
  isDarkTheme = false;
  @Input('substories') substories!: string[];
  currentSubstory = '';

  constructor(
    private _userSettings: UserSettingsService) {
    
  }

  ngOnInit(): void {
    // Get theme info
    this.isDarkTheme = this._userSettings.isDarkTheme(this._userSettings.getDefaultTheme());
    this._userSettings.currentThemeStream.subscribe((theme) => {
      this.isDarkTheme = this._userSettings.isDarkTheme(theme);
    });

    this.currentSubstory = this.substories.length ? this.substories[0] : '';
  }
  

}