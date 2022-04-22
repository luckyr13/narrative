import { Injectable } from '@angular/core';
import { bundleAndSignData, createData, DataItem, Bundle } from "arbundles";
import { ArweaveSigner } from "arbundles/src/signing/chains";
import { JWKInterface } from 'arweave/web/lib/wallet';
import { from, Observable } from 'rxjs';
import { CreateTransactionInterface } from 'arweave/web/common';
import Arweave from 'arweave';
import { ArweaveService } from './arweave.service';
import Transaction from 'arweave/web/lib/transaction';

@Injectable({
  providedIn: 'root'
})
export class ArbundlesService {

  constructor(private _arweave: ArweaveService) { }

  private async _createData(data: string[] | Uint8Array[], jwk: JWKInterface): Promise<Bundle> {
    const dataItems: DataItem[] = [];
    const signer = new ArweaveSigner(jwk);

    for (const d of data) {
      dataItems.push(createData(d, signer));
    }

    const bundle = await bundleAndSignData(dataItems, signer);

    console.log('data', data, 'signer', signer, 'dataItems', dataItems, 'bundle', bundle);

    return bundle;

  }

  public createData(data: string[] | Uint8Array[], jwk: JWKInterface): Observable<Bundle> {
    return from(this._createData(data, jwk));
  }

  public createBundledTX(
    bundle: Bundle,
    attributes: Partial<Omit<CreateTransactionInterface, "data">>,
    jwk: JWKInterface) {
    return from(bundle.toTransaction(attributes, this._arweave.arweave, jwk));
  }
}
