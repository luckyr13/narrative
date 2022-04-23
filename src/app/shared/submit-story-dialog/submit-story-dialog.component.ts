import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { from, Observable, Subscription, concatMap, of } from 'rxjs';
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

    const textSubstories = this.data.substories.filter((substory) => {
      return substory.type === 'text';
    });

    const imagesSubstories = this.data.substories.filter((substory) => {
      return substory.type === 'image';
    });
    const imagesTxList = imagesSubstories.map((substory) => {
      return substory.id;
    });

    // Substories detected?
    if (this.data.substories && this.data.substories.length) {
      this.loadingPostingSubstories = true;
      this.postingSubstoriesSubscription = from(textSubstories).pipe(
        concatMap((substory) => {
          return this._story.createPost(substory.content, disableDispatch, [], true);
        })
      ).subscribe({
        next: (tx) => {
          substoriesTxList.push(tx.id);
        },
        error: (err) => {
          if (typeof err === 'string') {
            this._utils.message(err, 'error');
          } else if (err && err.message) {
            this._utils.message(err.message, 'error');
          } else {
            this._utils.message('Error :(', 'error');
          }
          this.loadingPostingSubstories = false;
          this.close('');
        },
        complete: () => {
          this.loadingPostingSubstories = false;
          substoriesTxList.push(...imagesTxList);
          this.createMainStory(this.data.mainStory, substoriesTxList, disableDispatch);
        }
      });
    } else {
      substoriesTxList.push(...imagesTxList);
      this.createMainStory(this.data.mainStory, substoriesTxList, disableDispatch);
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
        if (typeof err === 'string') {
          this._utils.message(err, 'error');
        } else if (err && err.message) {
          this._utils.message(err.message, 'error');
        } else {
          this._utils.message('Error :(', 'error');
        }
        this.loadingPostingMainStory = false;
        this.close('');
      }
    });
  }

  ngOnDestroy() {

  }




}
