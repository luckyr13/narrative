import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { UserSettingsService } from '../../core/services/user-settings.service';

@Component({
  selector: 'app-story-player',
  templateUrl: './story-player.component.html',
  styleUrls: ['./story-player.component.scss']
})
export class StoryPlayerComponent implements OnInit {
  isDarkTheme = false;
  @Input('substories') substories!: {id: string, type: 'tx'|'youtube', position: number}[];
  @Input('fullMode') fullMode: boolean = false;
  currentSubstory: { id: string, type: 'tx'|'youtube', position: number }|null = null;
  currentSubstoryIdArrPos = 0;
  infiniteScrollActive = true;
  loadingSubstory = false;

  constructor(
    private _userSettings: UserSettingsService,
    private _cd: ChangeDetectorRef) {
    
  }

  fillSubstories() {
   
    this.currentSubstoryIdArrPos = 0;
    this.currentSubstory = this.substories.length ? this.substories[this.currentSubstoryIdArrPos] : null;
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
    this._cd.detectChanges();
  }

  playStoryByPosition(pos: number) {
    this.currentSubstoryIdArrPos = pos;
    this.currentSubstory = this.substories[this.currentSubstoryIdArrPos];
  }

}