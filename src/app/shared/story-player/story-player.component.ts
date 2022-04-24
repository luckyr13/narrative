import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { from, Observable, Subscription, switchMap, tap, catchError, of, map } from 'rxjs';
import { UtilsService } from '../../core/utils/utils.service';
import { ArweaveService } from '../../core/services/arweave.service';
import { SubstoryService } from '../../core/services/substory.service';
import { TransactionMetadata } from '../../core/interfaces/transaction-metadata';
import { UserSettingsService } from '../../core/services/user-settings.service';

@Component({
  selector: 'app-story-player',
  templateUrl: './story-player.component.html',
  styleUrls: ['./story-player.component.scss']
})
export class StoryPlayerComponent implements OnInit {
  @Input('substories') substories!: string[];
  substoriesContent: Record<string, {content: string, loading: boolean, error: string, type: string}> = {};
  substoriesContentSubscription = Subscription.EMPTY;
  isDarkTheme = false;

  constructor(
    private _utils: UtilsService,
    private _arweave: ArweaveService,
    private _substory: SubstoryService,
    private _userSettings: UserSettingsService) {
    
  }

  ngOnInit(): void {
    for (const substoryId of this.substories) {
      this.substoriesContent[substoryId] = {content: '', loading: true, error: '', type: ''};
    }

    const substories = this.getSubstories();
    this.substoriesContentSubscription = from(substories).pipe(
      switchMap((txId) => {
        return this.loadMetadata(txId);
      }),
      switchMap((tx) => {
        const tags = tx.tags!;
        let contentType = '';

        for (const t of tags) {
          if (t.name === 'Content-Type') {
            this.substoriesContent[tx.id].type = t.value;
            if (t.value.indexOf('image') >= 0) {
              let fileURL = `${this._arweave.baseURL}${tx.id}`;
              fileURL = this._utils.sanitizeFull(`${fileURL}`);
              this.substoriesContent[tx.id].loading = false;
              this.substoriesContent[tx.id].content = fileURL;
              return of(fileURL);
            }
          }
        }
        return this.loadContent(tx.id);
      })
    ).subscribe(() => {

    });

    // Get theme info
    this.isDarkTheme = this._userSettings.isDarkTheme(this._userSettings.getDefaultTheme());
    this._userSettings.currentThemeStream.subscribe((theme) => {
      this.isDarkTheme = this._userSettings.isDarkTheme(theme);
    });
  }

  loadContent(txId: string): Observable<string|Uint8Array> {
    return this._arweave.getDataAsString(txId).pipe(
      tap({
        next: (content) => {
          this.substoriesContent[txId].content = this._utils.sanitize(`${content}`);
          this.substoriesContent[txId].loading = false;
          
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
          this.substoriesContent[txId].error = error;
          this.substoriesContent[txId].loading = false;
        }
      })
    );
  }

  loadMetadata(txId: string): Observable<TransactionMetadata> {
    return this._substory.getPost(txId).pipe(
      tap({
        next: (txData) => {
          // this.substoriesContent[txId].loading = false;
        },
        error: (error) => {
          this.substoriesContent[txId].error = error;
          this.substoriesContent[txId].loading = false;
        }
      })
    );
  }

  getSubstories() {
    return Object.keys(this.substoriesContent);
  }

  ngOnDestroy() {
    this.substoriesContentSubscription.unsubscribe();
  }

}