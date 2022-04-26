import { Component, OnInit, Input } from '@angular/core';
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
  currentSubstoryIdArrPos = 0;
  infiniteScrollActive = true;
  loadingSubstory = true;

  constructor(
    private _userSettings: UserSettingsService) {
    
  }

  ngOnInit(): void {
    // Get theme info
    this.isDarkTheme = this._userSettings.isDarkTheme(this._userSettings.getDefaultTheme());
    this._userSettings.currentThemeStream.subscribe((theme) => {
      this.isDarkTheme = this._userSettings.isDarkTheme(theme);
    });

    this.currentSubstory = this.substories.length ? this.substories[this.currentSubstoryIdArrPos] : '';
  }

  playNextStory(option: 'next'|'prev') {
    const numSubstories = this.substories.length;

    if (this.loadingSubstory) {
      return;
    }

    if (this.infiniteScrollActive) {
      if (option === 'next' && numSubstories > (this.currentSubstoryIdArrPos + 1)) {
        this.currentSubstoryIdArrPos += 1;
      } else if (option === 'next' && numSubstories <= (this.currentSubstoryIdArrPos + 1)) {
        this.currentSubstoryIdArrPos = 0;
      } else if (option === 'prev' && (this.currentSubstoryIdArrPos - 1) >= 0) {
        this.currentSubstoryIdArrPos -= 1;
      } else if (option === 'prev' && (this.currentSubstoryIdArrPos - 1) < 0) {
        this.currentSubstoryIdArrPos = numSubstories - 1;
      }
    } else {
      if (option === 'next' && numSubstories > (this.currentSubstoryIdArrPos + 1)) {
        this.currentSubstoryIdArrPos += 1;
      } else if (option === 'prev' && (this.currentSubstoryIdArrPos - 1) >= 0) {
        this.currentSubstoryIdArrPos -= 1;
      }
    }
    this.currentSubstory = this.substories[this.currentSubstoryIdArrPos];
  }

  updateLoadingSubstory(loading: boolean) {
    this.loadingSubstory = loading;
  }
  
}