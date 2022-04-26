import { Component, OnInit, Inject, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { Observable, Subscription, of } from 'rxjs';

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
    ]
  };
  @ViewChild('fileInput') fileInput!: ElementRef;
  file: {name: string, size: number, type: string, dataUrl: string, dataBlob: Blob|null } = {
    name: '',
    size: 0,
    type: '',
    dataUrl: '',
    dataBlob: null
  };
  readFileSubscription = Subscription.EMPTY;

  constructor(
    private _dialogRef: MatDialogRef<UploadFileDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      type: string,
    }) { }


  ngOnInit(): void {

  }

  close(confirm: boolean = false) {
    this._dialogRef.close(confirm);
  }

  dropFile(event: Event, type: string) {
    event.preventDefault();
    this.errorMessage01 = '';
    try {
      const ev = <DragEvent>event;
      const dataTransferApi = ev.dataTransfer!;
      let file: File|null = null;

      if (dataTransferApi.items) {
        if (dataTransferApi.items.length <= 0) {
          throw new Error('Empty file list');
        } else if (dataTransferApi.items.length > 1) {
          throw new Error('Please upload 1 file at a time.');
        }
        const item = dataTransferApi.items[0];
        if (item.kind !== 'file') {
          throw new Error('Only files allowed!');
        }
        file = item.getAsFile()!;

      } else {

        if (dataTransferApi.files.length <= 0) {
          throw new Error('Empty file list');
        } else if (dataTransferApi.files.length > 1) {
          throw new Error('Please upload 1 file at a time.');
        }
        file = dataTransferApi.files[0];
      }

      this.readFileSubscription = this.fileToDataUrl(file!, type).subscribe({
        next: (f) => {
          this.file.dataUrl = f;
        },
        error: (error) => {
          this.errorMessage01 = error;
        },
      });
    } catch (err) {
      console.error(err);
      this.errorMessage01 = `${err}`;
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
    this.readFileSubscription.unsubscribe();
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


  openFileExplorer() {
    this.fileInput.nativeElement.click();
  }

  fileToDataUrl(file: File, type: string): Observable<string> {
    this.errorMessage01 = '';

    let method = new Observable<string>((subscriber) => {
       // Transform .json file into key
       try {

        // Validate type first
        this.validateFileType(type, file!.type);

        const freader = new FileReader();
        freader.onload = async () => {
          try {
            const tmp_res: string = freader.result!.toString();

            if (file) {
              this.file.name = file.name;
              this.file.size = file.size;
              this.file.type = type;
            }

            subscriber.next(tmp_res);
            subscriber.complete();
          } catch (error) {
            throw Error('Error loading file');
          }
        }

        freader.onerror = () => {
          throw Error('Error reading file');
        }
        
        freader.readAsDataURL(file!);

       } catch (error) {
         subscriber.error(error);
       }
      
    });

    return method;
  }

  readFileFromInput(inputEvent: Event, type: string) {
    const target: HTMLInputElement = <HTMLInputElement>(inputEvent.target);
    const files: FileList = target.files!;
    const file = target && files.length ? 
      files[0] : null;
    
    this.readFileSubscription = this.fileToDataUrl(file!, type).subscribe({
      next: (f) => {
        this.file.dataUrl = f;
      },
      error: (error) => {
        this.errorMessage01 = error;
      },
    });

  }

  getSupportedFilesAsStr(type: string) {
    return this.supportedFiles[type].join(',');
  }

  validateFileType(type: string, fileType: string) {
    if (type in this.supportedFiles) {
      if (this.supportedFiles[type].indexOf(fileType) < 0) {
        throw new Error(`${fileType} is not of type ${type}`);
      }
    } else {
      throw new Error(`${type} not supported`);
    }
  }
}
