import { Injectable } from '@angular/core';
import { ArweaveService } from '../../core/services/arweave.service';
import { Observable, EMPTY, of, throwError, Subject} from 'rxjs';
import { tap } from 'rxjs/operators';
import { FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {
  private _account: Subject<string>;
  // Observable string streams
  public account$: Observable<string>;
  // User's private key
  private _arKey: any = null;
  // User's arweave public address
  private _mainAddress: string = '';
  // Login method 
  private _method: string = '';


  constructor(
    private _arweave: ArweaveService) {
    this._account = new Subject<string>();
    this.account$ = this._account.asObservable();
   
  }

  public loadAccount() {
    const mainAddress = window.sessionStorage.getItem('MAINADDRESS')
      || window.localStorage.getItem('MAINADDRESS');
    const arkey = window.sessionStorage.getItem('ARKEY')
      || window.localStorage.getItem('ARKEY');
    const method = window.sessionStorage.getItem('METHOD')
      || window.localStorage.getItem('METHOD');

    if (mainAddress) {
      this._mainAddress = mainAddress
      this._method = method!;
      if (arkey) { this._arKey = JSON.parse(arkey) }
      this._account.next(mainAddress);
      if (this._method === 'webwallet') {
        this._arweave.arweaveWebWallet.connect().then((res: any) => {
          this._mainAddress = res;
          this._account.next(this._mainAddress);
        }).catch((error: any) => {
          console.log('Error loading address');
        });
      }
    }
  }

  public setAccount(mainAddress: string, arKey: any = null, stayLoggedIn: boolean = false, method='') {
    const storage = stayLoggedIn ? window.localStorage : window.sessionStorage;
    this._mainAddress = mainAddress;
    this._method = method;
    storage.setItem('MAINADDRESS', mainAddress);
    storage.setItem('METHOD', method);
    if (arKey) {
      this._arKey = arKey
      storage.setItem('ARKEY', JSON.stringify(this._arKey))
    }
    this._account.next(mainAddress);
  }

  public removeAccount() {
    this._account.next('');
    this._mainAddress = '';
    this._method = '';
    this._arKey = null;
    for (let key of ['MAINADDRESS', 'ARKEY', 'METHOD']) {
      window.sessionStorage.removeItem(key)
      window.localStorage.removeItem(key)
    }
  }


  public getMainAddressSnapshot(): string {
    return this._mainAddress;
  }

  public getPrivateKey() {
    return this._arKey ? this._arKey : 'use_wallet'
  }

  public login(walletOption: string, uploadInputEvent: any = null, stayLoggedIn: boolean = false): Observable<string> {
    let method = of('');

    switch (walletOption) {
      case 'upload_file':
        method = this._arweave.uploadKeyFile(uploadInputEvent).pipe(
            tap( (_res: any) => {
              this.removeAccount()
              this.setAccount(_res.address, _res.key, stayLoggedIn, walletOption)
            })
          );
      break;
      case 'arconnect':
        method = this._arweave.getAccount(walletOption).pipe(
            tap( (_account: any) => {
              this.removeAccount()
              this.setAccount(_account.toString(), null, stayLoggedIn, walletOption)
            })
          );
      break;
      case 'webwallet':
        method = this._arweave.getAccount(walletOption).pipe(
            tap( (_account: any) => {
              this.removeAccount()
              this.setAccount(_account.toString(), null, stayLoggedIn, walletOption)
            })
          );
      break;
      case 'finnie':
        method = this._arweave.getAccount(walletOption).pipe(
            tap( (_account: any) => {
              this.removeAccount()
              this.setAccount(_account.toString(), null, stayLoggedIn, walletOption)
            })
          );
      break;
      default:
        return throwError('Wallet not supported');
      break;
    }

    return method;
  }

  public logout() {
    if ((this._method === 'finnie' || 
        this._method === 'arconnect' || 
        this._method === 'webwallet') &&
        (window && window.arweaveWallet)) {
      window.arweaveWallet.disconnect();
    }
    this.removeAccount();
  }


}
