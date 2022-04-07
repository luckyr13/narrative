import { Component, OnInit, Inject, OnDestroy} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-search-story-dialog',
  templateUrl: './search-story-dialog.component.html',
  styleUrls: ['./search-story-dialog.component.scss']
})
export class SearchStoryDialogComponent implements OnInit, OnDestroy {

  constructor(
    private _dialogRef: MatDialogRef<SearchStoryDialogComponent>,
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
