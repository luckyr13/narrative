import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-create-story-dialog',
  templateUrl: './create-story-dialog.component.html',
  styleUrls: ['./create-story-dialog.component.scss']
})
export class CreateStoryDialogComponent implements OnInit {

  constructor(
    private _dialogRef: MatDialogRef<CreateStoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      account: string,
    }) { }

  ngOnInit(): void {
  }

  newStoryCreated(tx: string) {
    this.close(tx);
  }

  close(tx: string|null = null) {
    this._dialogRef.close(tx);
  }

}
