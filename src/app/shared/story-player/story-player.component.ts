import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { UserSettingsService } from '../../core/services/user-settings.service';

@Component({
  selector: 'app-story-player',
  templateUrl: './story-player.component.html',
  styleUrls: ['./story-player.component.scss']
})
export class StoryPlayerComponent implements OnInit {
  isDarkTheme = false;
  @Input('substories') substories!: string[];
  @Input('youtubeIds') youtubeIds!: string[];
  currentSubstory: { id: string, type: string }|null = null;
  currentSubstoryIdArrPos = 0;
  infiniteScrollActive = true;
  loadingSubstory = false;
  allSubstories: { id: string, type: string }[] = [];

  constructor(
    private _userSettings: UserSettingsService,
    private _cd: ChangeDetectorRef) {
    
  }

  fillSubstories() {
    // Fill allSubstories array
    for (const st of this.substories) {
      this.allSubstories.push({ id: st, type: 'tx' });
    }
    for (const yt of this.youtubeIds) {
      this.allSubstories.push({ id: yt, type: 'youtube' });
    }
    this.currentSubstoryIdArrPos = 0;
    this.currentSubstory = this.allSubstories.length ? this.allSubstories[this.currentSubstoryIdArrPos] : null;
  }

  ngOnInit(): void {

    this.fillSubstories();
    

    // Get theme info
    this.isDarkTheme = this._userSettings.isDarkTheme(this._userSettings.getDefaultTheme());
    this._userSettings.currentThemeStream.subscribe((theme) => {
      this.isDarkTheme = this._userSettings.isDarkTheme(theme);
    });

    
  }

  playNextStory(option: 'next'|'prev') {
    const numSubstories = this.allSubstories.length;

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
    this.currentSubstory = this.allSubstories[this.currentSubstoryIdArrPos];
  }

  updateLoadingSubstory(loading: boolean) {
    this.loadingSubstory = loading;
    this._cd.detectChanges();
  }

}