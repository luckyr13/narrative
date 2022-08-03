import { 
  Component, OnInit, OnDestroy, Input,
  ViewChild, ElementRef, NgZone } from '@angular/core';
import { ArweaveService } from '../../core/services/arweave.service';
import { VertoService } from '../../core/services/verto.service';
import { UserInterface } from '@verto/js/dist/common/faces';
import { Router, ActivatedRoute, ParamMap, Params } from '@angular/router';
import { Subscription, tap, Observable, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { StoryService } from '../../core/services/story.service';
import { UtilsService } from '../../core/utils/utils.service';
import { TransactionMetadata } from '../../core/interfaces/transaction-metadata';
import { ProfileResolverService } from '../../core/route-guards/profile-resolver.service';
import { UserProfile } from '../../core/interfaces/user-profile';
import { NetworkInfoInterface } from 'arweave/web/network';
import { AppSettingsService } from '../../core/services/app-settings.service';

@Component({
  selector: 'app-latest-stories',
  templateUrl: './latest-stories.component.html',
  styleUrls: ['./latest-stories.component.scss']
})
export class LatestStoriesComponent implements OnInit, OnDestroy {
  public posts: TransactionMetadata[] = [];
  private maxPosts: number = 10;
  public loadingPosts = false;
  private _postSubscription: Subscription = Subscription.EMPTY;
  private _nextResultsSubscription: Subscription = Subscription.EMPTY;
  public moreResultsAvailable = true;
  public addressList: string[] = [];
  @ViewChild('moreResultsCard', { read: ElementRef }) moreResultsCard!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private _verto: VertoService,
    private _arweave: ArweaveService,
    private _story: StoryService,
    private _utils: UtilsService,
    private _profileResolver: ProfileResolverService,
    private _appSettings: AppSettingsService,
    private _ngZone: NgZone) { }

  ngOnInit(): void {
    this.route.data
      .subscribe(data => {
        const profile: UserProfile = data['profile'];
        const userAddressList = profile.profile ?
          profile.profile.addresses :
          [profile.address];
        this.loadPosts(userAddressList);
      });

    this._appSettings.scrollTopStream.subscribe((scroll) => {
      this._ngZone.run(() => {
        const moreResultsPos = this.moreResultsCard.nativeElement.offsetTop -
          this.moreResultsCard.nativeElement.scrollTop;
        const padding = 700;
        if ((scroll > moreResultsPos - padding && moreResultsPos) && 
            !this.loadingPosts &&
            this.moreResultsAvailable) {
          this.moreResults();
        }
      });
      
    })
  }

  ngOnDestroy() {
    this._postSubscription.unsubscribe();
    this._nextResultsSubscription.unsubscribe();
  }

  loadPosts(from: string|string[]) {
    this.loadingPosts = true;
    this.posts = [];
    this._postSubscription = this._arweave.getNetworkInfo().pipe(
      switchMap((info: NetworkInfoInterface) => {
        const currentHeight = info.height;
        const tmpFrom = typeof from === 'string' ? [from] : from;
        const includeReposts = true;
        return this._story.getLatestPosts(
          tmpFrom, this.maxPosts, currentHeight, includeReposts
        );
      })
    ).subscribe({
      next: (posts) => {
        if (!posts || !(posts && posts.length)) {
          this.moreResultsAvailable = false;
        } else {
          this.posts.push(...posts);
        }
        this.loadingPosts = false;
      },
      error: (error) => {
        this.loadingPosts = false;
        this.moreResultsAvailable = false;
        this._utils.message(error, 'error');
      }
    })
  }

  moreResults() {
    this.loadingPosts = true;
    this._nextResultsSubscription = this._story.next().subscribe({
      next: (posts) => {
        if (!posts || !posts.length) {
          this.moreResultsAvailable = false;
        } else {
          this.posts.push(...posts);
        }
        this.loadingPosts = false;
      },
      error: (error) => {
        this.loadingPosts = false;
        this._utils.message(error, 'error');
      }
    })
  }

}
