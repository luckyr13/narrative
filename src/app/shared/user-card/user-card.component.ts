import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { VertoService } from '../../core/services/verto.service';
import { UserInterface } from '@verto/js/dist/common/faces';
import { Subscription } from 'rxjs';
import { ArweaveService } from '../../core/services/arweave.service';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss']
})
export class UserCardComponent implements OnInit, OnDestroy {
  @Input('address') address: string = '';
  profile: UserInterface|null|undefined = null;
  private _profileSubscription = Subscription.EMPTY;
  defaultProfileImage = 'assets/images/blank-profile.png';
   
  constructor(
    private _verto: VertoService,
    private _arweave: ArweaveService
  ) { }

  ngOnInit(): void {
    this._profileSubscription = this._verto.getProfile(this.address).subscribe({
      next: (profile) => {
        this.profile = profile;
      },
      error: (error) => {
        console.error('ErrProfile:', error);
      }
    });
  }

  ngOnDestroy() {
    this._profileSubscription.unsubscribe();
  }

  getImageUrl(txId: string) {
    if (txId) {
      return `${this._arweave.baseURL}${txId}`;
    }
    return this.defaultProfileImage;
  }

}
