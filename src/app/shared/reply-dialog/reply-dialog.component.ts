import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { from, Observable, Subscription, concatMap, of } from 'rxjs';
import { UtilsService } from '../../core/utils/utils.service';
import { FollowService } from '../../core/services/follow.service';

@Component({
  selector: 'app-reply-dialog',
  templateUrl: './reply-dialog.component.html',
  styleUrls: ['./reply-dialog.component.scss']
})
export class ReplyDialogComponent implements OnInit, OnDestroy {
  useDispatch = new FormControl(false);
  loadingFollow = false;
  followSubscription = Subscription.EMPTY;
  followTxId: string = '';

  constructor(
    private _dialogRef: MatDialogRef<ReplyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      username: string,
      wallets: string[]
    },
    private _utils: UtilsService,
    private _follow: FollowService) { }


  ngOnInit(): void {
  }

  close(success: boolean = false) {
    this._dialogRef.close(success);
  }

  submit() {
    const disableDispatch = !this.useDispatch.value;
    this.loadingFollow = true;
    this.followSubscription = this._follow.follow(
      this.data.username,
      this.data.wallets,
      disableDispatch
    ).subscribe({
      next: (tx) => {
        this.loadingFollow = false;
        this.followTxId = tx.id;
      },
      error: (error) => {
        this.loadingFollow = false
        console.error('Error!', error);
        this._utils.message('Error!', 'error');
      }
    });
       
  }


  ngOnDestroy() {
    this.followSubscription.unsubscribe();
  }

}
