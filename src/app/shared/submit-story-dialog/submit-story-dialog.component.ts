import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-submit-story-dialog',
  templateUrl: './submit-story-dialog.component.html',
  styleUrls: ['./submit-story-dialog.component.scss']
})
export class SubmitStoryDialogComponent implements OnInit {

  constructor(
    private _dialogRef: MatDialogRef<SubmitStoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      type: string,
      address: string
    }) { }


  ngOnInit(): void {
  }

  close(msg: string = '') {
    this._dialogRef.close(msg);
  }


}
