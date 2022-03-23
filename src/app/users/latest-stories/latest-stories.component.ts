import { Component, OnInit, OnDestroy } from '@angular/core';
import { ArweaveService } from '../../core/services/arweave.service';
import { VertoService } from '../../core/services/verto.service';
import { UserInterface } from '@verto/js/dist/common/faces';
import { Router, ActivatedRoute, ParamMap, Params } from '@angular/router';
import { Subscription, tap, Observable, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { StoryService } from '../../core/services/story.service';
import { UtilsService } from '../../core/utils/utils.service';
import { TransactionMetadata } from '../../core/interfaces/transaction-metadata';
import { NetworkInfoInterface } from 'arweave/web/network';

@Component({
  selector: 'app-latest-stories',
  templateUrl: './latest-stories.component.html',
  styleUrls: ['./latest-stories.component.scss']
})
export class LatestStoriesComponent implements OnInit {
  public posts: TransactionMetadata[] = [];
  private maxPosts: number = 10;
  public loadingPosts = false;
  private _postSubscription: Subscription = Subscription.EMPTY;
  private _nextResultsSubscription: Subscription = Subscription.EMPTY;
  public moreResultsAvailable = true;
  private _addressSubscription: Subscription = Subscription.EMPTY;
  public addressList: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private _verto: VertoService,
    private _arweave: ArweaveService,
    private _story: StoryService,
    private _utils: UtilsService) { }

  ngOnInit(): void {
    this._addressSubscription = this.route.paramMap.pipe(
        map((params) => {
          const address = params.get('address')!;
          return address;
        }),
        switchMap((address: string) => {
          return this.loadUserAddresses(address);
        })
      ).subscribe({
      next: (userAddressList) => {
        this.loadPosts(userAddressList);
      },
      error: (error) => {
        this._utils.message(error, 'error');
      }
    });
  }

  ngOnDestroy() {
    this._postSubscription.unsubscribe();
    this._nextResultsSubscription.unsubscribe();
    this._addressSubscription.unsubscribe();
  }

  loadPosts(from: string|string[]) {
    this.loadingPosts = true;
    this._postSubscription = this._arweave.getNetworkInfo().pipe(
      switchMap((info: NetworkInfoInterface) => {
        const currentHeight = info.height;
        const tmpFrom = typeof from === 'string' ? [from] : from;
        return this._story.getLatestPosts(tmpFrom, this.maxPosts, currentHeight);
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

  loadUserAddresses(address: string): Observable<string[]> {
    let addressList: string[] = [];
    return this._verto.getProfile(address).pipe(
      switchMap((profile: UserInterface|undefined) => {
        if (profile) {
          addressList = profile.addresses;
        } else if (this._arweave.validateAddress(address)) {
          addressList.push(address);
        } else {
          throw Error('Profile not found/incorrect address');
        }
        return of(addressList);
      })
    );
  }

}
