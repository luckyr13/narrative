import { Component, OnInit, Inject, OnDestroy} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-new-story-dialog',
  templateUrl: './new-story-dialog.component.html',
  styleUrls: ['./new-story-dialog.component.scss']
})
export class NewStoryDialogComponent implements OnInit, OnDestroy {

  constructor(
    private _dialogRef: MatDialogRef<NewStoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      type: string,
    }) { }


  ngOnInit(): void {
  }

  close(confirm: boolean = false) {
    this._dialogRef.close(confirm);
  }


  ngOnDestroy() {

  }


  hasOwnProperty(obj: any, key: string) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  }

}
