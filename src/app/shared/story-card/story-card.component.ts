import { Component, OnInit, Input } from '@angular/core';
import { TransactionMetadata } from '../../core/interfaces/transaction-metadata';
import { VertoService } from '../../core/services/verto.service';
import { Subscription, Observable } from 'rxjs';
import { UserAuthService } from '../../core/services/user-auth.service';
import { UserInterface } from '@verto/js/dist/faces';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ArweaveService } from '../../core/services/arweave.service';

@Component({
  selector: 'app-story-card',
  templateUrl: './story-card.component.html',
  styleUrls: ['./story-card.component.scss']
})
export class StoryCardComponent implements OnInit {
	@Input() post!: TransactionMetadata;
	loadingContent = false;
	loadingProfile = false;
	profileImage = 'assets/images/blank-profile.png';
  profileSubscription = Subscription.EMPTY;
  profile: UserInterface|null = null;

  constructor(
    private _verto: VertoService,
    private _auth: UserAuthService,
    private _snackBar: MatSnackBar,
    private _arweave: ArweaveService,) { }

  ngOnInit(): void {
    this.loadVertoProfile();
  }

  loadVertoProfile() {
    const account = this.post.owner;
    this.loadingProfile = true;
    this.profileSubscription = this._verto.getProfile(account).subscribe({
        next: (profile: UserInterface|undefined) => {
          this.profileImage = 'assets/images/blank-profile.png';
          
          if (profile) {
            if (profile.image) {
              this.profileImage = `${this._arweave.baseURL}${profile.image}`;
            }
            this.profile = profile;
          }
          this.loadingProfile = false;
        },
        error: (error) => {
          this.loadingProfile = false;
          this.message(error, 'error');
        }
      });
  }


  /*
  *  Custom snackbar message
  */
  message(msg: string, panelClass: string = '', verticalPosition: any = undefined) {
    this._snackBar.open(msg, 'X', {
      duration: 4000,
      horizontalPosition: 'center',
      verticalPosition: verticalPosition,
      panelClass: panelClass
    });
  }

}
