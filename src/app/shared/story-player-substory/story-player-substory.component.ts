import { Component, OnInit, Input, OnDestroy, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { from, Observable, Subscription, switchMap, tap, catchError, of, map } from 'rxjs';
import { SubstoryService } from '../../core/services/substory.service';
import { TransactionMetadata } from '../../core/interfaces/transaction-metadata';
import { ArweaveService } from '../../core/services/arweave.service';
import { UtilsService } from '../../core/utils/utils.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component'; 
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-story-player-substory',
  templateUrl: './story-player-substory.component.html',
  styleUrls: ['./story-player-substory.component.scss']
})
export class StoryPlayerSubstoryComponent implements OnInit, OnDestroy {
  substoryContent: { type: string, loading: boolean, content: string, error: string } = {
    type: '',
    loading: true,
    content: '',
    error: ''
  };
  substoryContentSubscription = Subscription.EMPTY;
  @Input('substoryId') substoryId!: string;
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
  @ViewChild('contentContainer') contentContainer!: ElementRef;

  /*
  *  Default: 
  *  Story: 100kb = 100000b
  *  Image: 1mb = 1000000b
  */
  storyMaxSizeBytes = 100000;
  storyImageMaxSizeBytes = 2000000;
  contentError = '';

  constructor(
    private _substory: SubstoryService,
    private _arweave: ArweaveService,
    private _utils: UtilsService,
    private _dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.load();
    
  }

  load() {
    this.substoryContentSubscription = this.loadMetadata(this.substoryId).pipe(
      switchMap((tx) => {
        const tags = tx.tags!;
        let contentType = '';
        const supportedFiles: string[] = [];

        for (const sfCat of Object.keys(this.supportedFiles)) {
          for (const sf of this.supportedFiles[sfCat]) {
            supportedFiles.push(sf);
          }
        }

        for (const t of tags) {
          if (t.name === 'Content-Type' && supportedFiles.indexOf(t.value) >= 0) {
            this.substoryContent.type = t.value;
            if (t.value.indexOf('image') >= 0) {
              // Check dataSize first
              const dataSize = +(tx.dataSize!);
              if (dataSize > this.storyImageMaxSizeBytes) {
                this.substoryContent.error = `Image is too big to be displayed. Size limit: ${this.storyImageMaxSizeBytes}bytes. Image size: ${dataSize} bytes.`;
                this.substoryContent.loading = false;
                throw new Error(this.substoryContent.error);
              }

              let fileURL = `${this._arweave.baseURL}${tx.id}`;
              fileURL = this._utils.sanitizeFull(`${fileURL}`);
              this.substoryContent.content = fileURL;
              this.substoryContent.loading = false;
              return of(fileURL);
            }
          }
        }
        const dataSize = +(tx.dataSize!);
        if (dataSize > this.storyMaxSizeBytes) {
          this.substoryContent.error = `Story is too big to be displayed. Size limit: ${this.storyMaxSizeBytes}bytes. Story size: ${dataSize} bytes.`;
          this.substoryContent.loading = false;
          throw new Error(this.substoryContent.error);
        }
        return this.loadContent(tx.id);
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
          this.substoryContent.content = this._utils.sanitize(`${content}`);
          this.substoryContent.loading = false;

         
        },
        error: (error) => {
          this.substoryContent.error = error;
          this.substoryContent.loading = false;
        }
      })
    );
  }

  loadMetadata(txId: string): Observable<TransactionMetadata> {
    this.substoryContent = {
      type: '',
      loading: true,
      content: '',
      error: ''
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
    if (changes && changes['substoryId'] && !changes['substoryId'].firstChange) {
      this.load();
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
        }
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
}
