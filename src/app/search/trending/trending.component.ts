import { Component, OnInit, OnDestroy } from '@angular/core';
import { TrendingService } from '../../core/services/trending.service';
import { ArweaveService } from '../../core/services/arweave.service';
import { UtilsService } from '../../core/utils/utils.service';
import { Subscription, switchMap, map } from 'rxjs';
import { TransactionMetadata } from '../../core/interfaces/transaction-metadata';
import { NetworkInfoInterface } from 'arweave/web/network';

@Component({
  selector: 'app-trending',
  templateUrl: './trending.component.html',
  styleUrls: ['./trending.component.scss']
})
export class TrendingComponent implements OnInit, OnDestroy {
  loadingMoreResults = false;
  resultsSubscription = Subscription.EMPTY;
  nextResultsSubscription = Subscription.EMPTY;
  maxPosts = 100;
  moreResultsAvailable = true;
  results: TransactionMetadata[] = [];
  loadingResults = false;
  hashtags: Record<string, {hashtag: string, qty: number, txs: string[]}> = {};
  mentions: Record<string, {mention: string, qty: number, txs: string[]}> = {};

  constructor(
    private _trending: TrendingService,
    private _arweave: ArweaveService,
    private _utils: UtilsService) { }

  ngOnInit(): void {
    this.loadingResults = true;
    this.resultsSubscription = this._arweave.getNetworkInfo().pipe(
      switchMap((info: NetworkInfoInterface) => {
        const currentHeight = info.height;
        return this._trending.getTrendingHashesAndMentions([], this.maxPosts, currentHeight);
      }),
      map((posts: TransactionMetadata[]) => {
        const filteredPosts = posts.filter((v) => {
          const tags = v.tags && v.tags.length ? v.tags : [];
          const numTags = tags.length;
          let hasHashtagsAndMentions = false;
          for (let i = 0; i < numTags; i++) {
            const t = tags[i];
            const tagName = t.name.toLowerCase();
            if (tagName === 'hashtag') {
              const hashtagValue = t.value.toLowerCase();
              if (Object.prototype.hasOwnProperty.call(this.hashtags, hashtagValue) &&
                this.hashtags[hashtagValue].txs.indexOf(v.owner) < 0) {
                this.hashtags[hashtagValue].qty += 1;
              } else {
                this.hashtags[hashtagValue] = { hashtag: hashtagValue, qty: 1, txs: [v.id] };
              }
              hasHashtagsAndMentions = true;
            } else if (tagName === 'mention') {

              const mentionValue = t.value;
              if (Object.prototype.hasOwnProperty.call(this.mentions, mentionValue) &&
                this.mentions[mentionValue].txs.indexOf(v.owner) < 0) {
                this.mentions[mentionValue].qty += 1;
              } else {
                this.mentions[mentionValue] = { mention: mentionValue, qty: 1, txs: [v.id] };
              }
              hasHashtagsAndMentions = true;
            }
          }
          return hasHashtagsAndMentions;
        });
        return filteredPosts;
      })
    ).subscribe({
      next: (posts) => {
        if (!posts || !posts.length) {
          this.moreResultsAvailable = false;
        }
        this.results.push(...posts);
        this.loadingResults = false;
      },
      error: (error) => {
        this.loadingResults = false;
        this.moreResultsAvailable = false;
        this._utils.message(error, 'error');
      }
    })
  }

  ngOnDestroy() {
    this.resultsSubscription.unsubscribe();
    this.nextResultsSubscription.unsubscribe();
  }

  getTrendingHashtags() {
    return Object.values(this.hashtags).sort((a, b) => {
      if (a.qty < b.qty) {
        return 1;
      }
      if (a.qty > b.qty) {
        return -1;
      }
      return 0;
    });
  }

  getTrendingMentions() {
    return Object.values(this.mentions).sort((a, b) => {
      if (a.qty < b.qty) {
        return 1;
      }
      if (a.qty > b.qty) {
        return -1;
      }
      return 0;
    });
  }

  getLocalSearchUrl(hashtag: string) {
    const hasht = hashtag.length && hashtag[0] === '#' ? hashtag.substr(1, hashtag.length) : hashtag;
    return `${this._utils.getBaseURL()}#/search/${hasht}`;
  }

  moreResults() {
    this.loadingMoreResults = true;
    this.nextResultsSubscription = this._trending.next().pipe(
        map((posts: TransactionMetadata[]) => {
          const filteredPosts = posts.filter((v) => {
            const tags = v.tags && v.tags.length ? v.tags : [];
            const numTags = tags.length;
            let hasHashtagsAndMentions = false;
            for (let i = 0; i < numTags; i++) {
              const t = tags[i];
              const tagName = t.name.toLowerCase();
              if (tagName === 'hashtag') {
                const hashtagValue = t.value.toLowerCase();
                if (Object.prototype.hasOwnProperty.call(this.hashtags, hashtagValue) &&
                  this.hashtags[hashtagValue].txs.indexOf(v.owner) < 0) {
                  this.hashtags[hashtagValue].qty += 1;
                } else {
                  this.hashtags[hashtagValue] = { hashtag: hashtagValue, qty: 1, txs: [v.id] };
                }
                hasHashtagsAndMentions = true;
              } else if (tagName === 'mention') {

                const mentionValue = t.value;
                if (Object.prototype.hasOwnProperty.call(this.mentions, mentionValue) &&
                  this.mentions[mentionValue].txs.indexOf(v.owner) < 0) {
                  this.mentions[mentionValue].qty += 1;
                } else {
                  this.mentions[mentionValue] = { mention: mentionValue, qty: 1, txs: [v.id] };
                }
                hasHashtagsAndMentions = true;
              }
            }
            return hasHashtagsAndMentions;
          });
          return filteredPosts;
        })
      ).subscribe({
      next: (posts) => {
        if (!posts || !posts.length) {
          this.moreResultsAvailable = false;
        }
        this.results = this.results.concat(posts);
        this.loadingMoreResults = false;
      },
      error: (error) => {
        this.loadingMoreResults = false;
        this.moreResultsAvailable = false;
        this._utils.message(error, 'error');
      }
    })
  }

}
