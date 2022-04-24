import { Component, OnInit, Input, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { from, Observable, Subscription, switchMap, tap, catchError, of, map } from 'rxjs';
import { SubstoryService } from '../../core/services/substory.service';
import { TransactionMetadata } from '../../core/interfaces/transaction-metadata';
import { ArweaveService } from '../../core/services/arweave.service';
import { UtilsService } from '../../core/utils/utils.service';

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

  constructor(
    private _substory: SubstoryService,
    private _arweave: ArweaveService,
    private _utils: UtilsService,) {
  }

  ngOnInit(): void {
    this.load();
    
  }

  load() {
    this.substoryContentSubscription = this.loadMetadata(this.substoryId).pipe(
      switchMap((tx) => {
        const tags = tx.tags!;
        let contentType = '';


        for (const t of tags) {
          if (t.name === 'Content-Type') {
            this.substoryContent.type = t.value;
            if (t.value.indexOf('image') >= 0) {
              let fileURL = `${this._arweave.baseURL}${tx.id}`;
              fileURL = this._utils.sanitizeFull(`${fileURL}`);
              this.substoryContent.content = fileURL;
              this.substoryContent.loading = false;
              return of(fileURL);
            }
          }
        }
        return this.loadContent(tx.id);
      })
    ).subscribe(() => {

    });
  }

  loadContent(txId: string): Observable<string|Uint8Array> {
    return this._arweave.getDataAsString(txId).pipe(
      tap({
        next: (content) => {
          this.substoryContent.content = this._utils.sanitize(`${content}`);
          this.substoryContent.loading = false;
          
          /*
          const links = this._utils.getLinks(`${content}`);
          const detectedLinks = links.map((val) => {
            return val.href;
          });
          window.setTimeout(() => {
            const aTags = this.contentContainer && this.contentContainer.nativeElement ? 
              this.contentContainer.nativeElement.getElementsByTagName('a') : [];
            for (const anchor of aTags) {
              anchor.addEventListener('click', (event: MouseEvent) => {
                event.stopPropagation();
              });
            }
          }, 400);
          */

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
    this.load();    
  }
}
