import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { UtilsService } from '../../core/utils/utils.service';
import { TransactionMetadata } from '../../core/interfaces/transaction-metadata';
import { Subscription } from 'rxjs';
import { FileExplorerService } from '../../core/services/file-explorer.service';
import { ArweaveService } from '../../core/services/arweave.service';

@Component({
  selector: 'app-file-manager-dialog',
  templateUrl: './file-manager-dialog.component.html',
  styleUrls: ['./file-manager-dialog.component.scss']
})
export class FileManagerDialogComponent implements OnInit, OnDestroy {
  supportedFiles: Record<string, string[]> = {
    'image': [
      'image/gif', 'image/png',
      'image/jpeg', 'image/bmp',
      'image/webp'
    ],
    'audio': [
      'audio/midi', 'audio/mpeg',
      'audio/webm', 'audio/ogg',
      'audio/wav'
    ],
    'video': [
      'video/webm', 'video/ogg', 'video/mp4'
    ],
    'text': [
      'text/plain'
    ],
  };
  files: TransactionMetadata[] = [];
  loadingFilesSubscription = Subscription.EMPTY;
  loadingFiles = false;

  constructor(
    private _dialogRef: MatDialogRef<FileManagerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      type: string,
      address: string,
    },
    private _utils: UtilsService,
    private _fileExplorer: FileExplorerService,
    private _arweave: ArweaveService) { }


  ngOnInit(): void {
    const types = this.supportedFiles[this.data.type];
    this.loadingFiles = true;
    const limit = 10;
    this.loadingFilesSubscription = this._fileExplorer.getUserFiles(types, this.data.address, limit).subscribe({
      next: (files) => {
        this.files = files;
        this.loadingFiles = false;
      },
      error: (error) => {
        this._utils.message(error, 'error');
        this.loadingFiles = false;
      }
    })
  }

  close(confirm: boolean = false) {
    this._dialogRef.close(confirm);
  }


  ngOnDestroy() {

  }


  hasOwnProperty(obj: any, key: string) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  }

  ellipsis(s: string) {
    return this._utils.ellipsis(s);
  }

  getFileUrl(tx: string) {
    return `${this._arweave.baseURL}${tx}`;
  }

  dateFormat(date: string|number|undefined) {
    const d = date ? date : '';
    return this._utils.dateFormat(d);
  }
}
