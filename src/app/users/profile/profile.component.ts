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
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
	loadingProfile = false;
  profileSubscription: Subscription = Subscription.EMPTY;
  profileImage: string = 'assets/images/blank-profile.png';
  nickname: string = '';
  addressList: string[] = [];
  addressSubscription: Subscription = Subscription.EMPTY;
  profileFound = false;
  bio: string = '';
  public posts: TransactionMetadata[] = [];
  private maxPosts: number = 10;
  public loadingPosts = false;
  private _postSubscription: Subscription = Subscription.EMPTY;
  private _nextResultsSubscription: Subscription = Subscription.EMPTY;
  moreResultsAvailable = true;
  
  constructor(
  	private route: ActivatedRoute,
  	private _verto: VertoService,
    private _arweave: ArweaveService,
    private _story: StoryService,
    private _utils: UtilsService
  ) { }

  ngOnInit(): void {
  	this.loadingProfile = true;

  	this.addressSubscription = this.route.paramMap.pipe(
        map((params) => {
          const address = params.get('address')!;
          return address;
        }),
  			switchMap((address: string) => {
          return this.loadProfile(address);
        })
  		).subscribe({
	  	next: (profile) => {
        this.loadingProfile = false;
        this.profileFound = true;
        this.loadPosts(this.addressList[0]);
	  	},
	  	error: (error) => {
	  		this.loadingProfile = false;
	  		this.profileFound = false;
	  		this._utils.message(error, 'error');
	  	}
	  });


  }

  loadPosts(from: string) {
    this.loadingPosts = true;
    this._postSubscription = this._arweave.getNetworkInfo().pipe(
      switchMap((info: NetworkInfoInterface) => {
        const currentHeight = info.height;
        return this._story.getLatestPosts([from], this.maxPosts, currentHeight);
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

  ngOnDestroy() {
  	this.profileSubscription.unsubscribe();
  	this.addressSubscription.unsubscribe();
  }

  validateAddress(address: string) {
  	// Validate address 
		const arweaveAddressLength = 43;

		if (address && address.length === arweaveAddressLength) {
			return true;
		}

    return false;
  }


  loadProfile(address: string): Observable<UserInterface|undefined> {
    this.profileImage = 'assets/images/blank-profile.png';
    this.nickname = '';
    this.bio = '';
    this.addressList = [];

    return this._verto.getProfile(address).pipe(
        switchMap((profile: UserInterface|undefined) => {
          if (profile) {
            this.addressList = profile.addresses;
            if (profile.image) {
              this.profileImage = `${this._arweave.baseURL}${profile.image}`;
            }
            if (profile.username) {
              this.nickname = profile.username;
            }
            if (profile.bio) {
              this.bio = profile.bio;
            }
          } else if (this.validateAddress(address)) {
            this.addressList.push(address);
          } else {
            throw Error('Profile not found/incorrect address');
          }
          return of(profile);
        })
      );
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


}
