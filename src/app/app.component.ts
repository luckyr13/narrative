import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { AppSettingsService } from './core/services/app-settings.service';
import { Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserAuthService } from './core/services/user-auth.service';
import { UtilsService } from './core/utils/utils.service';
import { MatDialog } from '@angular/material/dialog';
import { 
  ConfirmationDialogComponent 
} from './shared/confirmation-dialog/confirmation-dialog.component';
import { MatSidenavContainer } from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  opened = true;
  platformLoading$ = this._appSettings.loadingPlatform$;
  loadAccountSubscription: Subscription = Subscription.EMPTY;
  loginSubscription: Subscription = Subscription.EMPTY;
  @ViewChild(MatSidenavContainer) sidenavContainer!: MatSidenavContainer;

  constructor(
    private _appSettings: AppSettingsService,
    private _auth: UserAuthService,
    private _utils: UtilsService,
    public dialog: MatDialog
  ) {

  }

  ngOnInit() {
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
    this.consoleWelcomeMessage();
  }

  ngOnDestroy() {
    this.loadAccountSubscription.unsubscribe();
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

  ngAfterViewInit() {
    this.sidenavContainer.scrollable.elementScrolled().subscribe((ev) => {
      const target: any = ev.target;
      const scroll: number = target.scrollTop;
      this._appSettings.updateScrollTop(scroll);
    });
  }

  consoleWelcomeMessage() {
    console.log('%cWelcome to Narrative!', 'background: #FBD6D2; color: #000; font-size: 32px; padding: 10px; margin-bottom: 20px;');
  
  }

  
}
