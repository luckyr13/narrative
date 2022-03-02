import { Injectable } from '@angular/core';
import ArdbTransaction from 'ardb/lib/models/transaction';
import { Observable, from, map } from 'rxjs';
import { ArdbWrapper } from '../classes/ardb-wrapper';
import { ArweaveService } from './arweave.service';
import { TransactionMetadata } from '../interfaces/transaction-metadata';

@Injectable({
  providedIn: 'root'
})
export class StoryService {
  private _ardb: ArdbWrapper;

  constructor(private _arweave: ArweaveService) {
    this._ardb = new ArdbWrapper(this._arweave.arweave);
  }

  getLatestPosts(from: string[] | string = [], limit?: number, maxHeight?: number): Observable<TransactionMetadata[]> {
  	const tags = [
  		{
        name: "App-Name",
        values: ["Narrative"]
      },
      {
        name: "Content-Type",
        values: ["text/plain"]
      },
      {
        name: "Version",
        values: ["0.1"]
      },
      {
        name: "Type",
        values: ["Story"]
      },
  	];
  	return this._ardb.searchTransactions(from, limit, maxHeight, tags).pipe(
        map((_posts: ArdbTransaction[]) => {
          const res = _posts.map((tx) => {
            const post: TransactionMetadata = {
              id: tx.id,
              owner: tx.owner.address,
              blockId: tx.block.id,
              blockHeight: tx.block.height,
              dataSize: tx.data.size,
              dataType: tx.data.type,
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
              blockId: tx.block.id,
              blockHeight: tx.block.height,
              dataSize: tx.data.size,
              dataType: tx.data.type,
            }
            return post;
          }) : [];
          return res;
        })
    	);
  }


}
