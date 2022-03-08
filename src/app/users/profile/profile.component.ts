import { Component, OnInit, OnDestroy } from '@angular/core';
import { ArweaveService } from '../../core/services/arweave.service';
import { VertoService } from '../../core/services/verto.service';
import { UserInterface } from '@verto/js/dist/faces';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription, tap, Observable } from 'rxjs';
import { StoryService } from '../../core/services/story.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
	loadingData = false;
  profileSubscription: Subscription = Subscription.EMPTY;
  profileImage: string = 'assets/images/blank-profile.png';
  nickname: string = '';
  address: string = '';
  addressSubscription: Subscription = Subscription.EMPTY;
  
  constructor(
  	private route: ActivatedRoute,
  	private _verto: VertoService,
    private _arweave: ArweaveService,
    private _story: StoryService,
  ) { }

  ngOnInit(): void {
  	this.addressSubscription = this.route.paramMap.subscribe({
	  	next: (params) => {
	  		this.address = params.get('address')!;
	  	},
	  	error: (error) => {
	  		console.error(error);
	  	}
	  });
  }

  ngOnDestroy() {
  	this.profileSubscription.unsubscribe();
  	this.addressSubscription.unsubscribe();
  }

}
