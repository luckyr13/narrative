import { Injectable } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(
    private _snackBar: MatSnackBar) { }


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

  ellipsis(s: string) {
    const minLength = 10;
    const sliceLength = 6;

    return s.length < minLength ? s : `${s.substring(0, sliceLength)}...${s.substring(s.length - sliceLength, s.length)}`;
  }

}
