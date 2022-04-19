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
      address: string
    }) { }


  ngOnInit(): void {
  }

  close(msg: string = '') {
    this._dialogRef.close(msg);
  }


  ngOnDestroy() {

  }


  hasOwnProperty(obj: any, key: string) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  }


  newStoryCreated(storyContent: string) {
    this.close(storyContent);
  }

}
