import { Component, OnInit, OnDestroy } from '@angular/core';
import { StoryService } from '../core/services/story.service';
import { Subscription } from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import { TransactionMetadata } from '../core/interfaces/transaction-metadata';
import { UserAuthService } from '../core/services/user-auth.service';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  private _postSubscription: Subscription = Subscription.EMPTY;
  private _nextResultsSubscription: Subscription = Subscription.EMPTY;
  public posts: TransactionMetadata[] = [];
  private maxPosts: number = 10;
  public loadingPosts = false;
  account: string = '';

  constructor(
    private _story: StoryService,
    private _snackBar: MatSnackBar,
    private _auth: UserAuthService) { }

  ngOnInit(): void {
    this.loadingPosts = true;
    this.account = this._auth.getMainAddressSnapshot();

    this._postSubscription = this._story.getLatestPosts([], this.maxPosts).subscribe({
      next: (posts) => {
        this.posts = posts;
        this.loadingPosts = false;
      },
      error: (error) => {
        this.loadingPosts = false;
        this.message(error, 'error');
      }
    })

    this._auth.account$.subscribe((_account) => {
      this.account = _account;
    });

  }

  moreResults() {
    this.loadingPosts = true;
    this._nextResultsSubscription = this._story.next().subscribe({
      next: (posts) => {
        this.posts = this.posts.concat(posts);
        this.loadingPosts = false;
      },
      error: (error) => {
        this.loadingPosts = false;
        this.message(error, 'error');
      }
    })
  }

  ngOnDestroy() {
    this._postSubscription.unsubscribe();
    this._nextResultsSubscription.unsubscribe();
  }

  /*
  *  Custom snackbar message
  */
  message(msg: string, panelClass: string = '', verticalPosition: any = undefined) {
    this._snackBar.open(msg, 'X', {
      duration: 8000,
      horizontalPosition: 'center',
      verticalPosition: verticalPosition,
      panelClass: panelClass
    });
  }

}
