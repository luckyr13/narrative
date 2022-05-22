import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserProfile } from '../../core/interfaces/user-profile';
import { ArweaveService } from '../../core/services/arweave.service';
import { UserAuthService } from '../../core/services/user-auth.service';
import { FollowDialogComponent } from '../../shared/follow-dialog/follow-dialog.component'; 
import {MatDialog} from '@angular/material/dialog';
import { Subscription, switchMap } from 'rxjs';
import { FollowService } from '../../core/services/follow.service';
import { NetworkInfoInterface } from 'arweave/web/network';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  profileImage: string = 'assets/images/blank-profile.png';
  username: string = '';
  addressList: string[] = [];
  bio: string = '';
  name: string = '';
  addressRouteParam = '';
  editProfileFlag = false;
  isLoggedIn = false;
  maxFollowers = 100;
  maxFollowing = 100;
  numFollowers = 0;
  numFollowing = 0;
  private _followersSubscription = Subscription.EMPTY;
  private _followingSubscription = Subscription.EMPTY;
  
  constructor(
    private _route: ActivatedRoute,
    private _arweave: ArweaveService,
    private _auth: UserAuthService,
    private _dialog: MatDialog,
    private _follow: FollowService) { }

  ngOnInit(): void {
    // Profile already loaded
    this._route.data
    .subscribe(data => {
      const profile: UserProfile = data['profile'];
      this.profileImage = 'assets/images/blank-profile.png';
      this.username = '';
      this.bio = '';
      this.addressList = [];
      this.name = '';

      if (profile.profile) {
        if (profile.profile.image) {
          this.profileImage = `${this._arweave.baseURL}${profile.profile.image}`;
        }
        this.name = profile.profile.name;
        this.username = profile.profile.username;
        this.bio = profile.profile.bio!;
        this.addressList = profile.profile.addresses;
      } else if (profile.address) {
        this.addressList = [profile.address];
      }

      // Validate current user
      const currentAddress = this._auth.getMainAddressSnapshot();
      this.isLoggedIn = !!currentAddress;
      this.validateCurrentAddress(currentAddress);

      this.loadFollowers(this.username, this.addressList);
      this.loadFollowing(this.addressList);
      
    });

    this._route.paramMap.subscribe((params) => {
      this.addressRouteParam = params.get('address')!;
    });

    this._auth.account$.subscribe((currentAddress) => {
      this.isLoggedIn = !!currentAddress;
      this.validateCurrentAddress(currentAddress);
    });

  }

  validateCurrentAddress(currentAddress: string) {
    this.editProfileFlag = false;
    if (this.addressList.indexOf(currentAddress) >= 0) {
      this.editProfileFlag = true;
    }
  }

  confirmFollowDialog(username:string, wallets: string[]) {
    const dialogRef = this._dialog.open(
      FollowDialogComponent,
      {
        restoreFocus: false,
        autoFocus: false,
        disableClose: true,
        data: {
          content: `Do you really want to follow ${username}?`,
          closeLabel: 'No',
          confirmLabel: 'Yes, I want to follow this user',
          wallets: wallets,
          username: username
        }
      }
    );

    dialogRef.afterClosed().subscribe((confirm: string) => {
      
    });
  }

  loadFollowers(username: string, wallets: string|string[]) {
    this.numFollowers = 0;
    this._followersSubscription = this._arweave.getNetworkInfo().pipe(
      switchMap((info: NetworkInfoInterface) => {
        const currentHeight = info.height;
        return this._follow.getFollowers(username, wallets, this.maxFollowers, currentHeight);
      }),
    ).subscribe({
      next: (followers) => {
        this.numFollowers = (new Set(followers)).size;
      },
      error: (error) => {
        console.error('ErrFollowers', error);
      }
    })

  }

  loadFollowing(from: string[]) {
    this.numFollowers = 0;
    this._followingSubscription = this._arweave.getNetworkInfo().pipe(
      switchMap((info: NetworkInfoInterface) => {
        const currentHeight = info.height;
        return this._follow.getFollowing(from, this.maxFollowers, currentHeight);
      }),
    ).subscribe({
      next: (following) => {
        this.numFollowing = (new Set(following)).size;
      },
      error: (error) => {
        console.error('ErrFollowing', error);
      }
    })
  }

  ngOnDestroy() {
    this._followingSubscription.unsubscribe();
    this._followersSubscription.unsubscribe();
  }

  

}
