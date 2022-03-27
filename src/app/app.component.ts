import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserSettingsService } from './core/services/user-settings.service';
import { Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserAuthService } from './core/services/user-auth.service';
import { UtilsService } from './core/utils/utils.service';
import { MatDialog } from '@angular/material/dialog';
import { 
  ConfirmationDialogComponent 
} from './shared/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  opened = true;
  platformLoading$ = this._userSettings.loadingPlatform$;
  openerSubscription: Subscription = Subscription.EMPTY;
  loadAccountSubscription: Subscription = Subscription.EMPTY;
  loginSubscription: Subscription = Subscription.EMPTY;

  constructor(
    private _userSettings: UserSettingsService,
    private _auth: UserAuthService,
    private _utils: UtilsService,
    public dialog: MatDialog
  ) {

  }

  ngOnInit() {
		this.openerSubscription = this._userSettings.showMainToolbar$.subscribe((show) => {
			this.opened = show;
		});
    this.loadAccountSubscription = this._auth.loadAccount().subscribe({
      next: (success) => {
        if (success) {
          this._utils.message(`Welcome back!`, 'success');
        }
      },
      error: (error) => {
        if (error == 'Error: LaunchArweaveWebWalletModal') {
          // Resume session dialog
          this.resumeSessionDialog();

        } else {
          this._utils.message(error, 'error');
        }
      }
    });
  }

  ngOnDestroy() {
  	this.openerSubscription.unsubscribe();
  }

  toggle(val: boolean) {
    this.opened = !this.opened;
  }

  resumeSessionDialog() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: '',
        content: 'Resume Arweave Web Wallet session?',
        confirmLabel: 'Resume Session',
        closeLabel: 'Dismiss',
        confirmColor: '',
        closeColor: 'accent'
      },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const stayLoggedIn = this._auth.getStayLoggedIn();
        // Throw Arweave Web Wallet dialog
        this.loginSubscription = this._auth.login(
          'arweavewebwallet',
          null,
          stayLoggedIn
        ).subscribe({
          next: (address: string) => {
            this._utils.message('Connection successful!', 'success');
          },
          error: (error) => {
            this._utils.message(`Error: ${error}`, 'error');
          }
        });
      }
    });
  }


  
}
