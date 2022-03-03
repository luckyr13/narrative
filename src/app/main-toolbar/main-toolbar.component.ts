import { Component, OnInit, Input, Output, EventEmitter  } from '@angular/core';
import { FormControl } from '@angular/forms';
import { UserSettingsService } from '../core/services/user-settings.service';
import { UserAuthService } from '../core/services/user-auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { BottomSheetLoginComponent } from '../shared/bottom-sheet-login/bottom-sheet-login.component';
import { Direction } from '@angular/cdk/bidi';
import { Router } from '@angular/router';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import { AppSettingsService } from '../core/services/app-settings.service';

@Component({
  selector: 'app-main-toolbar',
  templateUrl: './main-toolbar.component.html',
  styleUrls: ['./main-toolbar.component.scss']
})
export class MainToolbarComponent implements OnInit {
	theme = new FormControl('');
  @Output() toggleEvent = new EventEmitter<boolean>();
  account = this._auth.account$;
  appName = this._appSettings.appName;

  constructor(
    private _userSettings: UserSettingsService,
    private _snackBar: MatSnackBar,
    private _bottomSheet: MatBottomSheet,
    private _router: Router,
    private _auth: UserAuthService,
    private _appSettings: AppSettingsService) {

  }

  ngOnInit(): void {
    this.theme.setValue(this._userSettings.getDefaultTheme());
  }

  updateTheme(theme: string) {
  	try {
  		this._userSettings.setTheme(theme);
  	} catch (error) {
  		this.message(`Error: ${error}`, 'error');
  	}
  }

  toggle() {
    this.toggleEvent.emit(true);
  }

   /*
  *  Custom snackbar message
  */
  message(msg: string, panelClass: string = '', verticalPosition: any = undefined) {
    this._snackBar.open(msg, 'X', {
      duration: 8000,
      horizontalPosition: 'center',
      verticalPosition: verticalPosition,
      panelClass: panelClass
    });
  }

  /*
  *  @dev Modal login (or bottom sheet)
  */
  login() {
    const defLang = this._userSettings.getDefaultLang();
    /*
    let direction: Direction = defLang.writing_system === 'LTR' ? 
      'ltr' : 'rtl';
    */

    const sheet = this._bottomSheet.open(BottomSheetLoginComponent//, {
      // direction: direction
    //}
    );

    sheet.afterDismissed().subscribe((success) => {
      if (success) {
        // this._router.navigate(['home']);
      }
    });
  }


}
