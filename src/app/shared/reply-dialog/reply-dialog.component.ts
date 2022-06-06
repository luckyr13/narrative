import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { UntypedFormControl } from '@angular/forms';
import { from, Observable, Subscription, concatMap, of } from 'rxjs';
import { UtilsService } from '../../core/utils/utils.service';
import { ReplyService } from '../../core/services/reply.service';

@Component({
  selector: 'app-reply-dialog',
  templateUrl: './reply-dialog.component.html',
  styleUrls: ['./reply-dialog.component.scss']
})
export class ReplyDialogComponent implements OnInit, OnDestroy {
  useDispatch = new UntypedFormControl(false);
  loadingReply = false;
  private _replySubscription = Subscription.EMPTY;
  replyTxId: string = '';
  message: string = '';

  constructor(
    private _dialogRef: MatDialogRef<ReplyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      postOwner: string,
      txId: string,
      myAddress: string,
      postOwnerUsername: string,
      postOwnerImage: string,
      postContent: string
    },
    private _utils: UtilsService,
    private _reply: ReplyService) { }


  ngOnInit(): void {
  }

  close(msg: string = '') {
    this._dialogRef.close(msg);
  }

  submit() {
    const disableDispatch = !this.useDispatch.value;
    this.loadingReply = true;
    this._replySubscription = this._reply.reply(
      this.data.txId,
      this.message,
      disableDispatch
    ).subscribe({
      next: (tx) => {
        this.loadingReply = false;
        this.replyTxId = tx.id;
      },
      error: (error) => {
        this.loadingReply = false
        console.error('Error!', error);
        this._utils.message('Error!', 'error');
      }
    });
       
  }


  ngOnDestroy() {
    this._replySubscription.unsubscribe();
  }

  contentChangeEvent(storyContent: string) {
    this.message = storyContent;
  }
}
