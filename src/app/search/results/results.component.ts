import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, switchMap } from 'rxjs';
import { StoryService } from '../../core/services/story.service';
import { UtilsService } from '../../core/utils/utils.service';
import { ArweaveService } from '../../core/services/arweave.service';
import { TransactionMetadata } from '../../core/interfaces/transaction-metadata';
import { NetworkInfoInterface } from 'arweave/web/network';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit, OnDestroy {
  query: string = '';
  loadingPosts = false;
  posts: TransactionMetadata[] = [];
  moreResultsAvailable = true;
  private _postSubscription: Subscription = Subscription.EMPTY;
  private _nextResultsSubscription: Subscription = Subscription.EMPTY;
  private maxPosts: number = 10;

  constructor(
    private _route: ActivatedRoute,
    private _utils: UtilsService,
    private _story: StoryService,
    private _arweave: ArweaveService) { }

  ngOnInit(): void {

    this._route.paramMap.subscribe(async params => {
      this.query = params.get('query')! ? `${params.get('query')!}`.trim() : '';
      this.loadPosts(this.query);
      
    });

  }


  loadPosts(q: string) {
    
    this.loadingPosts = true;
    this._postSubscription = this._arweave.getNetworkInfo().pipe(
      switchMap((info: NetworkInfoInterface) => {
        const currentHeight = info.height;
        return this._story.getLatestPosts([], this.maxPosts, currentHeight);
      })
    ).subscribe({
      next: (posts) => {
        if (!posts || !posts.length) {
          this.moreResultsAvailable = false;
        }
        this.posts.push(...posts);
        this.loadingPosts = false;
      },
      error: (error) => {
        this.loadingPosts = false;
        this.moreResultsAvailable = false;
        this._utils.message(error, 'error');
      }
    })

  }


  moreResults() {
    this.loadingPosts = true;
    this._nextResultsSubscription = this._story.next().subscribe({
      next: (posts) => {
        if (!posts || !posts.length) {
          this.moreResultsAvailable = false;
        }
        this.posts = this.posts.concat(posts);
        this.loadingPosts = false;
      },
      error: (error) => {
        this.loadingPosts = false;
        this.moreResultsAvailable = false;
        this._utils.message(error, 'error');
      }
    })
  }

  ngOnDestroy() {
    this._postSubscription.unsubscribe();
    this._nextResultsSubscription.unsubscribe();
  }



}
