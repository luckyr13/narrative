import { Injectable } from '@angular/core';
import ArdbTransaction from 'ardb/lib/models/transaction';
import { Observable, from, map } from 'rxjs';
import { ArdbWrapper } from '../classes/ardb-wrapper';
import { ArweaveService } from './arweave.service';
import { TransactionMetadata } from '../interfaces/transaction-metadata';

@Injectable({
  providedIn: 'root'
})
export class SubstoryService {
  private _ardb: ArdbWrapper;

  constructor(
    private _arweave: ArweaveService,) {
    this._ardb = new ArdbWrapper(this._arweave.arweave);
  }

  getPost(postId: string): Observable<TransactionMetadata> {
    return this._ardb.searchOneTransactionById(postId).pipe(
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
            blockTimestamp: tx.block && tx.block.timestamp ? tx.block.timestamp : undefined,
            tags: tx.tags
          }
          return post;
        })
      );
  }


}
