import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
declare const window: any;
declare const document: any;

@Injectable({
  providedIn: 'root'
})
export class AppSettingsService {
	appName = 'Narrative';
	appVersion = '0.4.1';

  // Dev protocol
  // protocolVersion = '0.0-dev';

  // Prod protocol
	protocolVersion = '0.1';
  protocolName = 'Narrative';

  private _loadingPlatform: Subject<boolean> = new Subject<boolean>();
  public loadingPlatform$ = this._loadingPlatform.asObservable();
  private _showMainToolbar: Subject<boolean> = new Subject<boolean>();
  public showMainToolbar$ = this._showMainToolbar.asObservable();

	// Observable string sources
  private _scrollTopSource = new Subject<number>();

  // Observable string streams
  public scrollTopStream = this._scrollTopSource.asObservable();

  supportedFiles: Record<string, string[]> = {
    'image': [
      'image/gif', 'image/png',
      'image/jpeg', 'image/bmp',
      'image/webp'
    ],
    'audio': [
      'audio/midi', 'audio/mpeg',
      'audio/webm', 'audio/ogg',
      'audio/wav'
    ],
    'video': [
      'video/webm', 'video/ogg', 'video/mp4'
    ],
    'text': [
      'text/plain'
    ],
  };

  /*
  *  Default: 
  *  Story: 100kb = 100000b
  *  Image: 3mb = 3000000b
  *  Audio: 10mb = 10000000b
  *  Video: 200mb = 200000000b
  */
  storyMaxSizeBytes = 100000;
  storyImageMaxSizeBytes = 3000000;
  storyVideoMaxSizeBytes = 200000000;
  storyAudioMaxSizeBytes = 10000000;

  public updateScrollTop(_scroll: number) {
    this._scrollTopSource.next(_scroll);
  }

  constructor() { }
  
  setLoadingPlatform(_isLoading: boolean) {
    this._loadingPlatform.next(_isLoading);
  }

  setShowMainToolbar(_show: boolean) {
    this._showMainToolbar.next(_show);
  }


  scrollPageToTop() {
    const container = document.getElementById('ww-mat-sidenav-main-content');
    if (container) {
      container.scrollTop = 0;
    }
  }

  scrollTo(to_id: string, offset: number = 0) {
    const container = document.getElementById('ww-mat-sidenav-main-content');
    const to = document.getElementById(to_id);
    const toData = to.getBoundingClientRect();
    container.scrollTop += toData.top + offset;
  }
}
