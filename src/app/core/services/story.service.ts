import { Injectable } from '@angular/core';
import ArdbTransaction from 'ardb/lib/models/transaction';
import { Observable, from, map } from 'rxjs';
import { ArdbWrapper } from '../classes/ardb-wrapper';
import { ArweaveService } from './arweave.service';
import { TransactionMetadata } from '../interfaces/transaction-metadata';
import { UserAuthService } from './user-auth.service';
import { AppSettingsService } from './app-settings.service';

@Injectable({
  providedIn: 'root'
})
export class StoryService {
  private _ardb: ArdbWrapper;

  constructor(
    private _arweave: ArweaveService,
    private _userAuth: UserAuthService,
    private _appSettings: AppSettingsService) {
    this._ardb = new ArdbWrapper(this._arweave.arweave);
  }

  createPost(msg: string) {
    const key = this._userAuth.getPrivateKey();
    const loginMethod = this._userAuth.loginMethod;
    const tags: {name: string, value: string}[] = [
      { name: 'App-Name', value: this._appSettings.appName },
      { name: 'Version', value: this._appSettings.protocolVersion },
      { name: 'Type', value: 'Story' },
      { name: 'Network', value: 'Koii' }
    ];
    return this._arweave.uploadFileToArweave(msg, 'text/plain', key, tags, loginMethod );
  }

  getLatestPosts(from: string[] | string = [], limit?: number, maxHeight?: number): Observable<TransactionMetadata[]> {
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
        values: ["Story"]
      },
      /*
      // Koii filter
      {
        name: "Network",
        values: ["Koii"]
      },
      */
  	];
  	return this._ardb.searchTransactions(from, limit, maxHeight, tags).pipe(
        map((_posts: ArdbTransaction[]) => {
          const res = _posts.map((tx) => {

            const post: TransactionMetadata = {
              id: tx.id,
              owner: tx.owner.address,
              blockId: tx.block && tx.block.id ? tx.block.id : '',
              blockHeight: tx.block && tx.block.height ? tx.block.height : 0,
              dataSize: tx.data ? tx.data.size : undefined,
              dataType: tx.data ? tx.data.type : undefined,
              blockTimestamp: tx.block && tx.block.timestamp ? tx.block.timestamp : undefined
            }
            return post;
          });

          return res;
        })
      );
  }

  next(): Observable<TransactionMetadata[]> {
    return from(this._ardb.next()).pipe(
    		map((_posts: ArdbTransaction[]) => {
          const res = _posts && _posts.length ? _posts.map((tx) => {
            const post: TransactionMetadata = {
              id: tx.id,
              owner: tx.owner.address,
              blockId: tx.block && tx.block.id ? tx.block.id : '',
              blockHeight: tx.block && tx.block.height ? tx.block.height : 0,
              dataSize: tx.data ? tx.data.size : undefined,
              dataType: tx.data ? tx.data.type : undefined,
              blockTimestamp: tx.block && tx.block.timestamp ? tx.block.timestamp : undefined
            }
            return post;
          }) : [];
          return res;
        })
    	);
  }

  getPost(from: string[] | string = [], postId: string): Observable<TransactionMetadata> {
    return this._ardb.searchOneTransaction(from, postId).pipe(
        map((tx: ArdbTransaction) => {
          if (!tx) {
            throw new Error('Tx not found!');
          }
          const post: TransactionMetadata = {
            id: tx.id,
            owner: tx.owner.address,
            blockId: tx.block && tx.block.id ? tx.block.id : '',
            blockHeight: tx.block && tx.block.height ? tx.block.height : 0,
            dataSize: tx.data ? tx.data.size : undefined,
            dataType: tx.data ? tx.data.type : undefined,
            blockTimestamp: tx.block && tx.block.timestamp ? tx.block.timestamp : undefined
          }
          return post;
        })
      );
  }


  getPendingPosts(
    from: string[] | string = [], limit?: number, maxHeight?: number
  ): Observable<TransactionMetadata[]> {
   
    return this.getLatestPosts(from, limit, maxHeight).pipe(
        map((_posts: TransactionMetadata[]) => {
          const res = _posts.filter((post) => {
            return !!!post.blockId;
          })
          return res;
        })
      );
  }


}
