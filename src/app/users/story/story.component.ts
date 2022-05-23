import { Component, OnInit, OnDestroy } from '@angular/core';
import { ArweaveService } from '../../core/services/arweave.service';
import { VertoService } from '../../core/services/verto.service';
import { UserInterface } from '@verto/js/dist/common/faces';
import { Router, ActivatedRoute, ParamMap, Params } from '@angular/router';
import { Subscription, tap, Observable, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { StoryService } from '../../core/services/story.service';
import { UtilsService } from '../../core/utils/utils.service';
import { TransactionMetadata } from '../../core/interfaces/transaction-metadata';
import { NetworkInfoInterface } from 'arweave/web/network';
import { UserProfile } from '../../core/interfaces/user-profile';
import { ReplyService } from '../../core/services/reply.service';

@Component({
  selector: 'app-story',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.scss']
})
export class StoryComponent implements OnInit {
  public post: TransactionMetadata|null = null;
  public loadingPost = false;
  private _postSubscription: Subscription = Subscription.EMPTY;
  public addressList: string[] = [];
  public loadingReplies = false;
  public replies: TransactionMetadata[] = [];
  private _repliesSubscription: Subscription = Subscription.EMPTY;
  private _maxReplies = 20;

  constructor(
    private route: ActivatedRoute,
    private _verto: VertoService,
    private _arweave: ArweaveService,
    private _story: StoryService,
    private _utils: UtilsService,
    private _reply: ReplyService) { }

  ngOnInit(): void {
    this.route.data
      .subscribe(data => {
        const storyId = this.route.snapshot.paramMap.get('storyId')!;
        const profile: UserProfile = data['profile'];
        const userAddressList = profile.profile ?
          profile.profile.addresses :
          [profile.address];
        this.loadPost(userAddressList, storyId);
        this.loadReplies(storyId);
      });
  }

  ngOnDestroy() {
    this._postSubscription.unsubscribe();
    this._repliesSubscription.unsubscribe();
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


}
