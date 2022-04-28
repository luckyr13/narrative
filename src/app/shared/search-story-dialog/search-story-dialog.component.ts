import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ArweaveService, arweaveAddressLength } from '../../core/services/arweave.service';

@Component({
  selector: 'app-search-story-dialog',
  templateUrl: './search-story-dialog.component.html',
  styleUrls: ['./search-story-dialog.component.scss']
})
export class SearchStoryDialogComponent implements OnInit, OnDestroy {
  searchForm: FormGroup = new FormGroup({
    'query': new FormControl(
      '',
      [
        Validators.required,
        Validators.minLength(arweaveAddressLength),
        Validators.maxLength(arweaveAddressLength)
      ]
    )
  });

  get query() {
    return this.searchForm.get('query')!;
  }

  constructor(
    private _dialogRef: MatDialogRef<SearchStoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      type: string,
    },
    private _arweave: ArweaveService) { }


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


  onSubmitSearch() {
    //const query = encodeURI(this.query!.value);
    const query = this.query!.value ? `${this.query!.value}`.trim() : '';

    if (query) {
      alert(query)
    }
  
  }

}
