import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { UntypedFormControl } from '@angular/forms';
import { from, Observable, Subscription, concatMap, of } from 'rxjs';
import { UtilsService } from '../../core/utils/utils.service';
import { RepostService } from '../../core/services/repost.service';

@Component({
  selector: 'app-repost-dialog',
  templateUrl: './repost-dialog.component.html',
  styleUrls: ['./repost-dialog.component.scss']
})
export class RepostDialogComponent implements OnInit, OnDestroy {
  useDispatch = new UntypedFormControl(false);
  loadingRepost = false;
  private _repostSubscription = Subscription.EMPTY;
  repostTxId: string = '';

  constructor(
    private _dialogRef: MatDialogRef<RepostDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      postOwner: string,
      txId: string,
      myAddress: string,
      postOwnerUsername: string,
      postOwnerImage: string,
      postContent: string
    },
    private _utils: UtilsService,
    private _repost: RepostService) { }


  ngOnInit(): void {
  }

  close(msg: string = '') {
    this._dialogRef.close(msg);
  }

  submit() {
    const disableDispatch = !this.useDispatch.value;
    this.loadingRepost = true;
    this._repostSubscription = this._repost.repost(
      this.data.txId,
      disableDispatch
    ).subscribe({
      next: (tx) => {
        this.loadingRepost = false;
        this.repostTxId = tx.id;
      },
      error: (error) => {
        this.loadingRepost = false
        console.error('Error!', error);
        this._utils.message('Error!', 'error');
      }
    });
       
  }


  ngOnDestroy() {
    this._repostSubscription.unsubscribe();
  }

}
