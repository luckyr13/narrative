import { Component, OnInit, Inject, OnDestroy, NgZone } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

/*
*  Based on Drag and Drop tutorial:
*  https://developer.mozilla.org/es/docs/Web/API/HTML_Drag_and_Drop_API/File_drag_and_drop
*/

@Component({
  selector: 'app-upload-file-dialog',
  templateUrl: './upload-file-dialog.component.html',
  styleUrls: ['./upload-file-dialog.component.scss']
})
export class UploadFileDialogComponent implements OnInit, OnDestroy {
  errorMessage01: string = '';
  dragFileActive = false;
  enterCounter = 0;
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
    private _dialogRef: MatDialogRef<UploadFileDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      type: string,
    },
    private _ngZone: NgZone) { }


  ngOnInit(): void {
  }

  close(confirm: boolean = false) {
    this._dialogRef.close(confirm);
  }

  dropFile(event: Event) {
    event.preventDefault();
    const ev = <DragEvent>event;
    const dataTransferApi = ev.dataTransfer!;

    if (dataTransferApi.items) {
      // Usar la interfaz DataTransferItemList para acceder a el/los archivos)
      for (var i = 0; i < dataTransferApi.items.length; i++) {
        // Si los elementos arrastrados no son ficheros, rechazarlos
        if (dataTransferApi.items[i].kind === 'file') {
          var file = dataTransferApi.items[i].getAsFile()!;
          console.log('... file[' + i + '].name = ' + file.name);
        }
      }
    } else {
      // Usar la interfaz DataTransfer para acceder a el/los archivos
      for (var i = 0; i < dataTransferApi.files.length; i++) {
        console.log('... file[' + i + '].name = ' + dataTransferApi.files[i].name);
      }
    }

    this.cleanDragData(event);
  }

  dragOverFile(event: Event) {
    event.preventDefault();
  }

  cleanDragData(event: Event) {
    this.enterCounter = 0;
    this.dragFileActive = false;
    const ev = <DragEvent>event;
    const dataTransferApi = ev.dataTransfer!;
    if (dataTransferApi.items) {
      // Use DataTransferItemList interface to remove the drag data
      dataTransferApi.items.clear();
    } else {
      // Use DataTransfer interface to remove the drag data
      dataTransferApi.clearData();
    }
  }

  ngOnDestroy() {

  }

  dragEnterFile(event: Event) {
    this.enterCounter++;
    this.dragFileActive = true;
    
  }

  dragLeaveFile(event: Event) {
    this.enterCounter--;

    if (this.enterCounter <= 0) {
      this.dragFileActive = false;
      this.enterCounter = 0;
    }
  }

  hasOwnProperty(obj: any, key: string) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  }

}
