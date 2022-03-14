import { Component, OnInit } from '@angular/core';
import { ArweaveService } from '../../core/services/arweave.service';

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.scss']
})
export class NetworkComponent implements OnInit {
  host = '';
  protocol = '';
  port = 0;
  baseURL = '';
  currentHeight = 0;

  constructor(
    private _arweave: ArweaveService
  ) {
    this.host = this._arweave.host;
    this.protocol = this._arweave.protocol;
    this.port = this._arweave.port;
    this.baseURL = this._arweave.baseURL;
    
  }

  ngOnInit(): void {
  }

}
