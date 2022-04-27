import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, switchMap, merge, of } from 'rxjs';
import { SearchService } from '../../core/services/search.service';
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
    private _search: SearchService,
    private _arweave: ArweaveService,
    private _story: StoryService) { }

  ngOnInit(): void {

    this._route.paramMap.subscribe(async params => {
      this.query = params.get('query')! ? `${params.get('query')!}`.trim() : '';
      this.loadPosts(this.query);
      
    });

  }


  breakQuery(q: string): {hashtags: string[], mentions: string[], from: string[]} {
    const words = q.split(' ');
    const numWords = words.length;
    const res: {hashtags: string[], mentions: string[], from: string[]} = {hashtags: [], mentions: [], from: []};
    for (let i = 0; i < numWords; i++) {
      let word = this.removeInitialSymbol(words[i].trim(), '#');
      word = this.removeInitialSymbol(words[i].trim(), '@');
      // Hashtag
      res.hashtags.push(`#${word.toLowerCase()}`);

      // Mention
      res.mentions.push(`@${word}`);

      // Address
      if (this._arweave.validateAddress(word)) {
        res.from.push(word);
      }
    }
    
    return res;
  }

  getStoriesIfFrom(from: string[], height: number) {
    if (from.length) {
      return this._story.getLatestPosts(from, this.maxPosts, height);
    }

    return of([]);
  }


  loadPosts(q: string) {
    const res = this.breakQuery(q);
    
    this.loadingPosts = true;
    this.posts = [];
    this._postSubscription = this._arweave.getNetworkInfo().pipe(
      switchMap((info: NetworkInfoInterface) => {
        const currentHeight = info.height;
        return merge(
          this._search.getLatestPostsHashtags(
            [],
            res.hashtags,
            this.maxPosts,
            currentHeight),
          this._search.getLatestPostsMentions(
            [],
            res.mentions,
            this.maxPosts,
            currentHeight),
          this.getStoriesIfFrom(
            res.from,
            currentHeight),
        )
      })
    ).subscribe({
      next: (posts) => {
        if (!posts || !posts.length) {
          this.moreResultsAvailable = false;
        }
        this.posts.push(...posts);
        // Enough time for UI
        window.setTimeout(() => {
          this.loadingPosts = false;
        }, 500);
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
    this._nextResultsSubscription = this._search.nextHashtags().subscribe({
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

  removeInitialSymbol(hashtag: string, symbol: string = '#') {
    return this._utils.removeInitialSymbol(hashtag, symbol);
  }



}
