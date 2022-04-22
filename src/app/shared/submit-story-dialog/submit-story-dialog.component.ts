import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { from, Observable, Subscription, switchMap, of } from 'rxjs';
import { UtilsService } from '../../core/utils/utils.service';
import { StoryService } from '../../core/services/story.service';

@Component({
  selector: 'app-submit-story-dialog',
  templateUrl: './submit-story-dialog.component.html',
  styleUrls: ['./submit-story-dialog.component.scss']
})
export class SubmitStoryDialogComponent implements OnInit {
  useDispatch = new FormControl(false);
  loadingPostingSubstories = false;
  loadingPostingMainStory = false;
  postingSubstoriesSubscription = Subscription.EMPTY;
  postingMainStorySubscription = Subscription.EMPTY;

  constructor(
    private _dialogRef: MatDialogRef<SubmitStoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      type: string,
      address: string,
      substories: any[],
      mainStory: string
    },
    private _utils: UtilsService,
    private _story: StoryService) { }


  ngOnInit(): void {
  }

  close(mainTx: string = '') {
    this._dialogRef.close(mainTx);
  }

  submit() {
    const disableDispatch = !this.useDispatch.value;
    const substoriesTxList: string[] = [];

    // Substories detected?
    if (this.data.substories && this.data.substories.length) {
      this.loadingPostingSubstories = true;
      this.postingSubstoriesSubscription = from(this.data.substories).pipe(
        switchMap((substory) => {
          if (substory.type === 'text') {
            return this._story.createPost(substory.content, disableDispatch, [], true);
          }
          return of({ id: substory.id, type: substory.type });
        })
      ).subscribe({
        next: (tx) => {
          substoriesTxList.push(tx.id);
        },
        error: (err) => {
          this._utils.message(err, 'error');
          this.loadingPostingSubstories = false;
          this.close('');
        },
        complete: () => {
          this.loadingPostingSubstories = false;
          this.createMainStory(this.data.mainStory, substoriesTxList, disableDispatch);
        }
      });
    } else {
      this.createMainStory(this.data.mainStory, [], disableDispatch);
    }
  }

  createMainStory(story: string, substoriesTXIds: string[], disableDispatch: boolean) {
    this.loadingPostingMainStory = true;
    const tags = [];
    for (const txId of substoriesTXIds) {
      tags.push({ name: 'Substory', value: txId });
    }
    this.postingSubstoriesSubscription = this._story.createPost(story, disableDispatch, tags).subscribe({
      next: (tx) => {
        this.loadingPostingMainStory = false;
        this._utils.message('Story created!', 'success');
        this.close(tx.id);
      },
      error: (err) => {
        this._utils.message(err, 'error');
        this.loadingPostingMainStory = false;
        this.close('');
      }
    });
  }

  ngOnDestroy() {

  }




}
