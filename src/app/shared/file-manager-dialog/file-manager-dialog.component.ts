import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

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

  constructor(
    private _dialogRef: MatDialogRef<FileManagerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      type: string,
    }) { }


  ngOnInit(): void {
  }

  close(confirm: boolean = false) {
    this._dialogRef.close(confirm);
  }


  ngOnDestroy() {

  }


  hasOwnProperty(obj: any, key: string) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  }

}
