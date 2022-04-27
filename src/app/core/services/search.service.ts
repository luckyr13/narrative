import { Injectable } from '@angular/core';
import ArdbTransaction from 'ardb/lib/models/transaction';
import { Observable, from, map } from 'rxjs';
import { ArdbWrapper } from '../classes/ardb-wrapper';
import { ArweaveService } from './arweave.service';
import { TransactionMetadata } from '../interfaces/transaction-metadata';
import { UserAuthService } from './user-auth.service';
import { AppSettingsService } from './app-settings.service';
import { UtilsService } from '../utils/utils.service';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private _ardbHash: ArdbWrapper;
  private _ardbMention: ArdbWrapper;

  constructor(
    private _arweave: ArweaveService,
    private _userAuth: UserAuthService,
    private _appSettings: AppSettingsService,
    private _utils: UtilsService) {
    this._ardbHash = new ArdbWrapper(this._arweave.arweave);
    this._ardbMention = new ArdbWrapper(this._arweave.arweave);
  }


  getLatestPostsHashtags(
    from: string[] | string = [],
    hashtags: string[],
    limit?: number, maxHeight?: number): Observable<TransactionMetadata[]> {
    const tags = [
      {
        name: "App-Name",
        values: [this._appSettings.appName]
      },
      {
        name: "Content-Type",
        values: ["text/plain"]
      },
      {
        name: "Version",
        values: [this._appSettings.protocolVersion]
      },
      {
        name: "Type",
        values: ["Story", "Substory"]
      },
      /*
      // Koii filter
      {
        name: "Network",
        values: ["Koii"]
      },
      */
    ];

    if (hashtags.length) {
      tags.push({ name: "Hashtag", values: hashtags });
    }

    return this._ardbHash.searchTransactions(from, limit, maxHeight, tags).pipe(
        map((_posts: ArdbTransaction[]) => {
          const res = _posts.map((tx) => {
            const post: TransactionMetadata = {
              id: tx.id,
              owner: tx.owner.address,
              blockId: tx.block && tx.block.id ? tx.block.id : '',
              blockHeight: tx.block && tx.block.height ? tx.block.height : 0,
              dataSize: tx.data ? tx.data.size : undefined,
              dataType: tx.data ? tx.data.type : undefined,
              blockTimestamp: tx.block && tx.block.timestamp ? tx.block.timestamp : undefined,
              tags: tx.tags
            }
            return post;
          });

          return res;
        })
      );
  }

  getLatestPostsMentions(
    from: string[] | string = [],
    mentions: string[],
    limit?: number, maxHeight?: number): Observable<TransactionMetadata[]> {
    const tags = [
      {
        name: "App-Name",
        values: [this._appSettings.appName]
      },
      {
        name: "Content-Type",
        values: ["text/plain"]
      },
      {
        name: "Version",
        values: [this._appSettings.protocolVersion]
      },
      {
        name: "Type",
        values: ["Story", "Substory"]
      },
      /*
      // Koii filter
      {
        name: "Network",
        values: ["Koii"]
      },
      */
    ];

    if (mentions.length) {
      tags.push({ name: "Mention", values: mentions });
    }

    return this._ardbMention.searchTransactions(from, limit, maxHeight, tags).pipe(
        map((_posts: ArdbTransaction[]) => {
          const res = _posts.map((tx) => {
            const post: TransactionMetadata = {
              id: tx.id,
              owner: tx.owner.address,
              blockId: tx.block && tx.block.id ? tx.block.id : '',
              blockHeight: tx.block && tx.block.height ? tx.block.height : 0,
              dataSize: tx.data ? tx.data.size : undefined,
              dataType: tx.data ? tx.data.type : undefined,
              blockTimestamp: tx.block && tx.block.timestamp ? tx.block.timestamp : undefined,
              tags: tx.tags
            }
            return post;
          });

          return res;
        })
      );
  }

  nextHashtags(): Observable<TransactionMetadata[]> {
    return from(this._ardbHash.next()).pipe(
        map((_posts: ArdbTransaction[]) => {
          const res = _posts && _posts.length ? _posts.map((tx) => {
            const post: TransactionMetadata = {
              id: tx.id,
              owner: tx.owner.address,
              blockId: tx.block && tx.block.id ? tx.block.id : '',
              blockHeight: tx.block && tx.block.height ? tx.block.height : 0,
              dataSize: tx.data ? tx.data.size : undefined,
              dataType: tx.data ? tx.data.type : undefined,
              blockTimestamp: tx.block && tx.block.timestamp ? tx.block.timestamp : undefined,
              tags: tx.tags
            }
            return post;
          }) : [];
          return res;
        })
      );
  }

  nextMentions(): Observable<TransactionMetadata[]> {
    return from(this._ardbMention.next()).pipe(
        map((_posts: ArdbTransaction[]) => {
          const res = _posts && _posts.length ? _posts.map((tx) => {
            const post: TransactionMetadata = {
              id: tx.id,
              owner: tx.owner.address,
              blockId: tx.block && tx.block.id ? tx.block.id : '',
              blockHeight: tx.block && tx.block.height ? tx.block.height : 0,
              dataSize: tx.data ? tx.data.size : undefined,
              dataType: tx.data ? tx.data.type : undefined,
              blockTimestamp: tx.block && tx.block.timestamp ? tx.block.timestamp : undefined,
              tags: tx.tags
            }
            return post;
          }) : [];
          return res;
        })
      );
  }


}
