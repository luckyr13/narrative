import { 
  Component, OnInit, Input, OnDestroy,
  OnChanges, SimpleChanges, ViewChild, ElementRef,
  Output, EventEmitter } from '@angular/core';
import { from, Observable, Subscription, switchMap, tap, catchError, of, map } from 'rxjs';
import { SubstoryService } from '../../core/services/substory.service';
import { TransactionMetadata } from '../../core/interfaces/transaction-metadata';
import { ArweaveService } from '../../core/services/arweave.service';
import { UtilsService } from '../../core/utils/utils.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component'; 
import {MatDialog} from '@angular/material/dialog';
import { SafeResourceUrl } from '@angular/platform-browser';
import { Direction } from '@angular/cdk/bidi';
import { UserSettingsService } from '../../core/services/user-settings.service';
import { AppSettingsService } from '../../core/services/app-settings.service';

@Component({
  selector: 'app-story-player-substory',
  templateUrl: './story-player-substory.component.html',
  styleUrls: ['./story-player-substory.component.scss']
})
export class StoryPlayerSubstoryComponent implements OnInit, OnDestroy {
  substoryContent: { 
    type: string, loading: boolean, content: string, error: string, raw: string
  } = {
    type: '',
    loading: true,
    content: '',
    error: '',
    raw: ''
  };
  substoryContentSubscription = Subscription.EMPTY;
  @Input('substory') substory!: { id: string, type: string};
  @Output() loadingSubstoryEvent = new EventEmitter<boolean>();
  @ViewChild('contentContainer') contentContainer!: ElementRef;
  owner: string = '';
  contentError = '';

  maxPreviewSize = 250;
  realPreviewSize = this.maxPreviewSize;

  @Input('fullMode') fullMode: boolean = false;

  constructor(
    private _substory: SubstoryService,
    private _arweave: ArweaveService,
    private _utils: UtilsService,
    private _dialog: MatDialog,
    private _userSettings: UserSettingsService,
    private _appSettings: AppSettingsService) {
  }

  ngOnInit(): void {
    if (this.substory.type === 'tx' && this.substory.id) {
      this.loadTx(this.substory.id);

    } else if (this.substory.type === 'youtube' && this.substory.id){
      this.loadYoutubeVideo(this.substory.id);

    } else {
      console.error('Player: Unknown type');
    }
    
  }

  loadTx(tx: string) {
    this.loadingSubstoryEvent.emit(true);
    this.realPreviewSize = this.maxPreviewSize;
    this.substoryContentSubscription = this.loadMetadata(tx).pipe(
      switchMap((tx) => {
        const tags = tx.tags!;
        let contentType = '';
        const supportedFiles: string[] = [];

        this.owner = tx.owner;

        for (const sfCat of Object.keys(this._appSettings.supportedFiles)) {
          for (const sf of this._appSettings.supportedFiles[sfCat]) {
            supportedFiles.push(sf);
          }
        }

        this.substoryContent.type = tx.dataType ? tx.dataType : '';
        if (this.substoryContent.type) {
          if (supportedFiles.indexOf(this.substoryContent.type) >= 0) {
            this.substoryContent.type = this.substoryContent.type;
            if (this.substoryContent.type.indexOf('image') >= 0) {
              // Check dataSize first
              const dataSize = tx.dataSize ? +(tx.dataSize) : 0;
              if (dataSize > this._appSettings.storyImageMaxSizeBytes) {
                this.substoryContent.error = `Image is too big to be displayed. Size limit: ${this._appSettings.storyImageMaxSizeBytes}bytes. Image size: ${dataSize} bytes.`;
                this.substoryContent.loading = false;
                this.loadingSubstoryEvent.emit(false);
                throw new Error(this.substoryContent.error);
              }

              let fileURL = `${this._arweave.baseURL}${tx.id}`;
              fileURL = this._utils.sanitizeFull(`${fileURL}`);
              this.substoryContent.content = fileURL;
              this.substoryContent.loading = false;
                this.loadingSubstoryEvent.emit(false);
              return of(fileURL);
            } else if (this.substoryContent.type.indexOf('video') >= 0) {
              // Check dataSize first
              const dataSize = tx.dataSize ? +(tx.dataSize) : 0;
              if (dataSize > this._appSettings.storyVideoMaxSizeBytes) {
                this.substoryContent.error = `Video is too big to be displayed. Size limit: ${this._appSettings.storyVideoMaxSizeBytes}bytes. Video size: ${dataSize} bytes.`;
                this.substoryContent.loading = false;
                this.loadingSubstoryEvent.emit(false);
                throw new Error(this.substoryContent.error);
              }

              let fileURL = `${this._arweave.baseURL}${tx.id}`;
              fileURL = this._utils.sanitizeFull(`${fileURL}`);
              this.substoryContent.content = fileURL;
              this.substoryContent.loading = false;
              this.loadingSubstoryEvent.emit(false);
              return of(fileURL);
            } else if (this.substoryContent.type.indexOf('audio') >= 0) {
              // Check dataSize first
              const dataSize = tx.dataSize ? +(tx.dataSize) : 0;
              if (dataSize > this._appSettings.storyAudioMaxSizeBytes) {
                this.substoryContent.error = `Audio is too big to be displayed. Size limit: ${this._appSettings.storyAudioMaxSizeBytes}bytes. Audio size: ${dataSize} bytes.`;
                this.substoryContent.loading = false;
                this.loadingSubstoryEvent.emit(false);
                throw new Error(this.substoryContent.error);
              }

              let fileURL = `${this._arweave.baseURL}${tx.id}`;
              fileURL = this._utils.sanitizeFull(`${fileURL}`);
              this.substoryContent.content = fileURL;
              this.substoryContent.loading = false;
              this.loadingSubstoryEvent.emit(false);
              return of(fileURL);
            } else if (this.substoryContent.type.indexOf('text') >= 0) {
              const dataSize = tx.dataSize ? +(tx.dataSize) : 0;
              if (dataSize > this._appSettings.storyMaxSizeBytes) {
                this.substoryContent.error = `Story is too big to be displayed. Size limit: ${this._appSettings.storyMaxSizeBytes}bytes. Story size: ${dataSize} bytes.`;
                this.substoryContent.loading = false;
                this.loadingSubstoryEvent.emit(false);
                throw new Error(this.substoryContent.error);
              }
              return this.loadContent(tx.id);
            }
          }
          
        } else {
          for (const t of tags) {
            if (t.name === 'Content-Type' && supportedFiles.indexOf(t.value) >= 0) {
              this.substoryContent.type = t.value;
              if (t.value.indexOf('image') >= 0) {
                // Check dataSize first
                const dataSize = tx.dataSize ? +(tx.dataSize) : 0;
                if (dataSize > this._appSettings.storyImageMaxSizeBytes) {
                  this.substoryContent.error = `Image is too big to be displayed. Size limit: ${this._appSettings.storyImageMaxSizeBytes}bytes. Image size: ${dataSize} bytes.`;
                  this.substoryContent.loading = false;
                  this.loadingSubstoryEvent.emit(false);
                  throw new Error(this.substoryContent.error);
                }

                let fileURL = `${this._arweave.baseURL}${tx.id}`;
                fileURL = this._utils.sanitizeFull(`${fileURL}`);
                this.substoryContent.content = fileURL;
                this.substoryContent.loading = false;
                  this.loadingSubstoryEvent.emit(false);
                return of(fileURL);
              } else if (t.value.indexOf('video') >= 0) {
                // Check dataSize first
                const dataSize = tx.dataSize ? +(tx.dataSize) : 0;
                if (dataSize > this._appSettings.storyVideoMaxSizeBytes) {
                  this.substoryContent.error = `Video is too big to be displayed. Size limit: ${this._appSettings.storyVideoMaxSizeBytes}bytes. Video size: ${dataSize} bytes.`;
                  this.substoryContent.loading = false;
                  this.loadingSubstoryEvent.emit(false);
                  throw new Error(this.substoryContent.error);
                }

                let fileURL = `${this._arweave.baseURL}${tx.id}`;
                fileURL = this._utils.sanitizeFull(`${fileURL}`);
                this.substoryContent.content = fileURL;
                this.substoryContent.loading = false;
                  this.loadingSubstoryEvent.emit(false);
                return of(fileURL);
              } else if (t.value.indexOf('audio') >= 0) {
                // Check dataSize first
                const dataSize = tx.dataSize ? +(tx.dataSize) : 0;
                if (dataSize > this._appSettings.storyAudioMaxSizeBytes) {
                  this.substoryContent.error = `Audio is too big to be displayed. Size limit: ${this._appSettings.storyAudioMaxSizeBytes}bytes. Audio size: ${dataSize} bytes.`;
                  this.substoryContent.loading = false;
                  this.loadingSubstoryEvent.emit(false);
                  throw new Error(this.substoryContent.error);
                }

                let fileURL = `${this._arweave.baseURL}${tx.id}`;
                fileURL = this._utils.sanitizeFull(`${fileURL}`);
                this.substoryContent.content = fileURL;
                this.substoryContent.loading = false;
                this.loadingSubstoryEvent.emit(false);
                return of(fileURL);
              } else if (t.value.indexOf('text') >= 0) {
                const dataSize = tx.dataSize ? +(tx.dataSize) : 0;
                if (dataSize > this._appSettings.storyMaxSizeBytes) {
                  this.substoryContent.error = `Story is too big to be displayed. Size limit: ${this._appSettings.storyMaxSizeBytes}bytes. Story size: ${dataSize} bytes.`;
                  this.substoryContent.loading = false;
                  this.loadingSubstoryEvent.emit(false);
                  throw new Error(this.substoryContent.error);
                }
                return this.loadContent(tx.id);
              }
            }
          }
        }
        
        
        throw new Error('Invalid substory type');
      })
    ).subscribe({
      next: () => {
        // Intercept click on anchors
        this.interceptClicks();
      },
      error: (error) => {
        
      }
    });
  }

  loadContent(txId: string): Observable<string|Uint8Array> {
    return this._arweave.getDataAsString(txId).pipe(
      tap({
        next: (content) => {

          this.substoryContent.raw = this._utils.sanitizeFull(`${content}`);
          if (this.substoryContent.raw.length < this.maxPreviewSize) {
            this.realPreviewSize = this.substoryContent.raw.length;
          }
          this.substoryContent.content = this.substr(this.substoryContent.raw, this.realPreviewSize);
          this.substoryContent.loading = false;
          this.loadingSubstoryEvent.emit(false);
         
        },
        error: (error) => {
          this.substoryContent.error = error;
          this.substoryContent.loading = false;
          this.loadingSubstoryEvent.emit(false);
        }
      })
    );
  }

  loadMetadata(txId: string): Observable<TransactionMetadata> {
    this.substoryContent = {
      type: '',
      loading: true,
      content: '',
      error: '',
      raw: ''
    };
    return this._substory.getPost(txId).pipe(
      tap({
        next: (txData) => {
          // this.substoriesContent[txId].loading = false;
        },
        error: (error) => {
          this.substoryContent.error = error;
          this.substoryContent.loading = false;
        }
      })
    );
  }

  ngOnDestroy() {
    this.substoryContentSubscription.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes['substory'] && !changes['substory'].firstChange) {
      if (this.substory.type === 'tx' && this.substory.id) {
        this.loadTx(this.substory.id);
      } else if (this.substory.type === 'youtube' && this.substory.id) {
        this.loadYoutubeVideo(this.substory.id);
      }
    }
  }

  interceptClicks() {
    window.setTimeout(() => {
      const aTags = this.contentContainer && this.contentContainer.nativeElement ? 
        this.contentContainer.nativeElement.getElementsByTagName('a') : [];
      for (const anchor of aTags) {
        anchor.addEventListener('click', (event: MouseEvent) => {
          event.stopPropagation();
          event.preventDefault();
          const anchor = <Element>event.target;
          if (anchor.getAttribute('target') === '_self') {
            window.location.href = anchor.getAttribute('href')!;
          } else {
            this.confirmDialog(anchor.getAttribute('href')!);
          }
        });
      }
    }, 400);
  }

  confirmDialog(href: string) {
    const defLang = this._userSettings.getDefaultLang();
    const defLangObj = this._userSettings.getLangObject(defLang);
    let direction: Direction = defLangObj && defLangObj.writing_system === 'LTR' ? 
      'ltr' : 'rtl';

    const dialogRef = this._dialog.open(
      ConfirmationDialogComponent,
      {
        restoreFocus: false,
        autoFocus: false,
        disableClose: false,
        data: {
          content: `Do you really want to visit this site? ${href}`,
          closeLabel: 'No',
          confirmLabel: 'Yes, open link in new tab'
        },
        direction: direction
      }
    );

    dialogRef.afterClosed().subscribe((confirm: string) => {
      if (confirm) {
        window.open(href, '_blank');
       
      }
    });
  }

  
  openStory(event: MouseEvent, txId: string) {
    event.stopPropagation();
    const url = `${this._arweave.baseURL}${txId}`;
    this.confirmDialog(url);
  }

  openLink(event: MouseEvent, link: string) {
    event.stopPropagation();
    this.confirmDialog(link);
  }

  showStoryMoreTextBtn() {
    return this.substoryContent.raw.length > this.maxPreviewSize && this.realPreviewSize !== `${this.substoryContent.raw}`.length;
  }

  substr(s: string, length: number) {
    const ellipsis = length <= this.maxPreviewSize && length < s.length ? '...' : '';
    return (this._utils.sanitize(s.substr(0, length)) + ellipsis);
  }


  seeMore(event: MouseEvent) {
    event.stopPropagation();
    this.realPreviewSize = `${this.substoryContent.raw}`.length;
    this.substoryContent.content = this.substr(this.substoryContent.raw, this.realPreviewSize);
    
    // Intercept click on anchors
    this.interceptClicks();
  }

  getYoutubeUrl(id: string) {
    return this._utils.youtubeVideoURL(id);
  }

  loadYoutubeVideo(youtubeId: string) {
    this.loadingSubstoryEvent.emit(true);
    this.substoryContent.error = '';
    this.substoryContent.type = 'youtube';
    this.substoryContent.loading = false;
    this.substoryContent.content = this._utils.youtubeVideoURLFull(youtubeId);
    this.loadingSubstoryEvent.emit(false);
  }
}
