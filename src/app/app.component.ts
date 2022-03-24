import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserSettingsService } from './core/services/user-settings.service';
import { Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserAuthService } from './core/services/user-auth.service';
import { UtilsService } from './core/utils/utils.service';

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

  constructor(
    private _userSettings: UserSettingsService,
    private _auth: UserAuthService,
    private _utils: UtilsService
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
          // TODO
          // Resume session?

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

}
