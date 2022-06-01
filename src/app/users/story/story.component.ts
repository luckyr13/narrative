import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { ArweaveService } from '../../core/services/arweave.service';
import { VertoService } from '../../core/services/verto.service';
import { UserInterface } from '@verto/js/dist/common/faces';
import { Router, ActivatedRoute, ParamMap, Params, Data } from '@angular/router';
import { Subscription, tap, Observable, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { StoryService } from '../../core/services/story.service';
import { UtilsService } from '../../core/utils/utils.service';
import { TransactionMetadata } from '../../core/interfaces/transaction-metadata';
import { NetworkInfoInterface } from 'arweave/web/network';
import { UserProfile } from '../../core/interfaces/user-profile';
import { ReplyService } from '../../core/services/reply.service';
import { LikeService } from '../../core/services/like.service';

@Component({
  selector: 'app-story',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.scss']
})
export class StoryComponent implements OnInit, OnDestroy {
  public post: TransactionMetadata|null = null;
  public loadingPost = false;
  private _postSubscription: Subscription = Subscription.EMPTY;
  public addressList: string[] = [];
  public loadingReplies = false;
  public replies: TransactionMetadata[] = [];
  private _repliesSubscription: Subscription = Subscription.EMPTY;
  private _nextRepliesSubscription: Subscription = Subscription.EMPTY;
  private _maxReplies = 10;
  moreResultsAvailable = true;
  @ViewChild('moreResultsCard', { read: ElementRef }) moreResultsCard!: ElementRef;

  public loadingLikes = false;
  public likes: TransactionMetadata[] = [];
  private _likesSubscription: Subscription = Subscription.EMPTY;
  public maxLikes = 50;

  constructor(
    private route: ActivatedRoute,
    private _verto: VertoService,
    private _arweave: ArweaveService,
    private _story: StoryService,
    private _utils: UtilsService,
    private _reply: ReplyService,
    private _like: LikeService) { }

  ngOnInit(): void {
    this.route.data
      .subscribe((data: Data) => {
        const storyId = this.route.snapshot.paramMap.get('storyId')!;
        const profile: UserProfile = data['profile'];
        const userAddressList = profile.profile ?
          profile.profile.addresses :
          [profile.address];
        this.loadPost(userAddressList, storyId);
        this.loadReplies(storyId);
        this.loadLikes(storyId);
      });
  }

  ngOnDestroy() {
    this._postSubscription.unsubscribe();
    this._repliesSubscription.unsubscribe();
    this._nextRepliesSubscription.unsubscribe();
    this._likesSubscription.unsubscribe();
  }

  loadPost(from: string|string[], storyId: string) {
    this.loadingPost = true;
    this.post = null;
    const tmpFrom = typeof from === 'string' ? [from] : from;
    this._postSubscription = this._story.getPost(tmpFrom, storyId).subscribe({
      next: (post) => {
        this.post = post;
        this.loadingPost = false;
      },
      error: (error) => {
        this.loadingPost = false;
        this._utils.message(error, 'error');
      }
    })
  }

  loadReplies(storyId: string) {
    this.loadingReplies = true;
    this.replies = [];
    this._repliesSubscription = this._arweave.getNetworkInfo().pipe(
      switchMap((info: NetworkInfoInterface) => {
        const currentHeight = info.height;
        return this._reply.getReplies(storyId, this._maxReplies, currentHeight)
      }),
    ).subscribe({
      next: (replies) => {
        this.replies = replies;
        this.loadingReplies = false;
      },
      error: (error) => {
        this.loadingReplies = false;
        this._utils.message(error, 'error');
      }
    })
  }

  moreReplies() {
    this.loadingReplies = true;
    this._nextRepliesSubscription = this._reply.next().subscribe({
      next: (replies) => {
        if (!replies || !replies.length) {
          this.moreResultsAvailable = false;
        } else {
          this.replies.push(...replies);
        }
        this.loadingReplies = false;
      },
      error: (error) => {
        this.loadingReplies = false;
        this.moreResultsAvailable = false;
        this._utils.message(error, 'error');
      }
    })
  }

  loadLikes(storyId: string) {
    this.loadingReplies = true;
    this.likes = [];
    this._repliesSubscription = this._arweave.getNetworkInfo().pipe(
      switchMap((info: NetworkInfoInterface) => {
        const currentHeight = info.height;
        return this._like.getStoryLikes(storyId, this.maxLikes, currentHeight)
      }),
    ).subscribe({
      next: (likes) => {
        for (const lk of likes) {
          if (!this.likes.find(v => v.id === lk.id)) {
            this.likes.push(lk);
          }
        }
        this.loadingLikes = false;
      },
      error: (error) => {
        this.loadingLikes = false;
        this._utils.message(error, 'error');
      }
    })
  }


}
