import { Component, OnInit, OnDestroy } from '@angular/core';
import { ArweaveService } from '../../core/services/arweave.service';
import { VertoService } from '../../core/services/verto.service';
import { UserInterface } from '@verto/js/dist/faces';
import { Router, ActivatedRoute, ParamMap, Params } from '@angular/router';
import { Subscription, tap, Observable } from 'rxjs';
import { StoryService } from '../../core/services/story.service';
import { UtilsService } from '../../core/utils/utils.service';

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
  address: string = '';
  addressSubscription: Subscription = Subscription.EMPTY;
  profileFound = false;
  
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
  			tap(this.validateAddress)
  		).subscribe({
	  	next: (params) => {
	  		this.address = params.get('address')!;
	  		this.loadingProfile = false;
	  		this.profileFound = true;
	  	},
	  	error: (error) => {
	  		this.loadingProfile = false;
	  		this.profileFound = false;
	  		this._utils.message(error, 'error');
	  	}
	  });

 		this.loadVertoProfile(this.address);

  }

  ngOnDestroy() {
  	this.profileSubscription.unsubscribe();
  	this.addressSubscription.unsubscribe();
  }

  validateAddress(params: ParamMap|Params) {
  	// Validate address 
		const address = params.get('address')!;
		const arweaveAddressLength = 43;

		if (!address || address.length != arweaveAddressLength) {
			throw Error('Invalid address');
		}
  }

  ellipsis(s: string) {
  	return this._utils.ellipsis(s);
  }

  loadVertoProfile(address: string) {
    this.loadingProfile = true;
    this.profileImage = 'assets/images/blank-profile.png';
    this.profileSubscription = this._verto.getProfile(address).subscribe({
        next: (profile: UserInterface|undefined) => {
          this.nickname = '';

          if (profile) {
            if (profile.image) {
              this.profileImage = `${this._arweave.baseURL}${profile.image}`;
            }
            if (profile.username) {
              this.nickname = profile.username;

            }
          }
          this.loadingProfile = false;
        },
        error: (error) => {
          this.loadingProfile = false;
          this._utils.message(error, 'error');
        }
      });
  }


}
