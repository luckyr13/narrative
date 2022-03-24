import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserProfile } from '../../core/interfaces/user-profile';
import { ArweaveService } from '../../core/services/arweave.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileImage: string = 'assets/images/blank-profile.png';
  username: string = '';
  addressList: string[] = [];
  bio: string = '';
  name: string = '';
  
  constructor(
    private _route: ActivatedRoute,
    private _arweave: ArweaveService) { }

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
      
    });

  }

  

}
