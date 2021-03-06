import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { UntypedFormControl } from '@angular/forms';
import { from, Observable, Subscription, concatMap, of } from 'rxjs';
import { UtilsService } from '../../core/utils/utils.service';
import { StoryService } from '../../core/services/story.service';

@Component({
  selector: 'app-submit-story-dialog',
  templateUrl: './submit-story-dialog.component.html',
  styleUrls: ['./submit-story-dialog.component.scss']
})
export class SubmitStoryDialogComponent implements OnInit, OnDestroy {
  useDispatch = new UntypedFormControl(false);
  loadingPostingSubstories = false;
  loadingPostingMainStory = false;
  postingSubstoriesSubscription = Subscription.EMPTY;
  postingMainStorySubscription = Subscription.EMPTY;

  constructor(
    private _dialogRef: MatDialogRef<SubmitStoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      type: string,
      address: string,
      substories: {id: string, content: string, type: 'text'|'image'|'video'|'audio', arrId: number}[],
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

    const videoSubstories = this.data.substories.filter((substory) => {
      return substory.type === 'video';
    });
    const videosTxList = videoSubstories.map((substory) => {
      return substory.id;
    });

    const audioSubstories = this.data.substories.filter((substory) => {
      return substory.type === 'audio';
    });
    const audiosTxList = audioSubstories.map((substory) => {
      return substory.id;
    });

    // Substories detected?
    if (this.data.substories && this.data.substories.length) {
      this.loadingPostingSubstories = true;
      this.postingSubstoriesSubscription = from(textSubstories).pipe(
        concatMap((substory) => {
          if (substory.id) {
            return of({id: substory.id});
          }
          return this._story.createPost(substory.content, disableDispatch, [], true, 'text');
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
          substoriesTxList.push(...videosTxList);
          substoriesTxList.push(...audiosTxList);
          this.createMainStory(this.data.mainStory, substoriesTxList, disableDispatch);
        }
      });
    } else {
      substoriesTxList.push(...imagesTxList);
      substoriesTxList.push(...videosTxList);
      substoriesTxList.push(...audiosTxList);
      this.createMainStory(this.data.mainStory, substoriesTxList, disableDispatch);
    }
  }

  createMainStory(story: string, substoriesTXIds: string[], disableDispatch: boolean) {
    this.loadingPostingMainStory = true;
    const tags = [];

    // Generate tags for Substories
    for (const txId of substoriesTXIds) {
      tags.push({ name: 'Substory', value: txId });
    }

    this.postingSubstoriesSubscription = this._story.createPost(story, disableDispatch, tags, false, 'text').subscribe({
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
    this.postingSubstoriesSubscription.unsubscribe();
    this.postingMainStorySubscription.unsubscribe();
  }

}
