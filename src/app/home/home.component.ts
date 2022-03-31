import { 
  Component, OnInit, OnDestroy,
  ViewChild, ElementRef, NgZone } from '@angular/core';
import { StoryService } from '../core/services/story.service';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { TransactionMetadata } from '../core/interfaces/transaction-metadata';
import { UserAuthService } from '../core/services/user-auth.service';
import { AppSettingsService } from '../core/services/app-settings.service';
import { UtilsService } from '../core/utils/utils.service';
import { ArweaveService } from '../core/services/arweave.service';
import { NetworkInfoInterface } from 'arweave/web/network';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  private _postSubscription: Subscription = Subscription.EMPTY;
  private _nextResultsSubscription: Subscription = Subscription.EMPTY;
  public posts: TransactionMetadata[] = [];
  private maxPosts: number = 10;
  public loadingPosts = false;
  account: string = '';
  version = this._appSettings.appVersion;
  moreResultsAvailable = true;
  @ViewChild('moreResultsCard', { read: ElementRef }) moreResultsCard!: ElementRef;

  constructor(
    private _story: StoryService,
    private _auth: UserAuthService,
    private _appSettings: AppSettingsService,
    private _utils: UtilsService,
    private _arweave: ArweaveService,
    private _ngZone: NgZone) { }

  ngOnInit(): void {
    this.loadingPosts = true;
    this.account = this._auth.getMainAddressSnapshot();

    this._auth.account$.subscribe((account) => {
      this.account = account;
    });

    this._postSubscription = this._arweave.getNetworkInfo().pipe(
      switchMap((info: NetworkInfoInterface) => {
        const currentHeight = info.height;
        return this._story.getLatestPosts([], this.maxPosts, currentHeight);
      })
    ).subscribe({
      next: (posts) => {
        if (!posts || !posts.length) {
          this.moreResultsAvailable = false;
        }
        this.posts = posts;
        this.loadingPosts = false;
      },
      error: (error) => {
        this.loadingPosts = false;
        this.moreResultsAvailable = false;
        this._utils.message(error, 'error');
      }
    })

    this._auth.account$.subscribe((_account) => {
      this.account = _account;
    });


    this._appSettings.scrollTopStream.subscribe((scroll) => {
      this._ngZone.run(() => {
        const moreResultsPos = this.moreResultsCard.nativeElement.offsetTop -
          this.moreResultsCard.nativeElement.scrollTop;
        const padding = 720;
        if ((scroll > moreResultsPos - padding) && 
            !this.loadingPosts &&
            this.moreResultsAvailable) {
          this.moreResults();
        }
      });
      
    })

    
  }

  moreResults() {
    this.loadingPosts = true;
    this._nextResultsSubscription = this._story.next().subscribe({
      next: (posts) => {
        if (!posts || !posts.length) {
          this.moreResultsAvailable = false;
        }
        this.posts = this.posts.concat(posts);
        this.loadingPosts = false;
      },
      error: (error) => {
        this.loadingPosts = false;
        this._utils.message(error, 'error');
      }
    })
  }

  ngOnDestroy() {
    this._postSubscription.unsubscribe();
    this._nextResultsSubscription.unsubscribe();
  }

  newStoryCreated(tx: string) {
    const txMeta: TransactionMetadata = {
      id: tx,
      owner: this.account
    };
    window.setTimeout(() => {
      this.posts.unshift(txMeta);
    }, 500);
  }

}
