import { Component, OnInit, ElementRef, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { EmojisComponent } from '../emojis/emojis.component';
import { Observable, Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CodeMirrorWrapper } from '../../core/classes/codemirror-wrapper';
import { UserInterface } from '@verto/js/dist/faces';
import { ArweaveService } from '../../core/services/arweave.service';
import { VertoService } from '../../core/services/verto.service';
import { UserAuthService } from '../../core/services/user-auth.service';

@Component({
  selector: 'app-create-story-card',
  templateUrl: './create-story-card.component.html',
  styleUrls: ['./create-story-card.component.scss']
})
export class CreateStoryCardComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('postMessage', {static: true}) postMessage!: ElementRef;
  loading: boolean = true;
  emojisPortal: ComponentPortal<EmojisComponent>|null = null;
  overlayRef: OverlayRef|null = null;
  loadEditorSubscription: Subscription = Subscription.EMPTY;
  codemirrorWrapper: CodeMirrorWrapper;
  loadingData = false;
  profileSubscription: Subscription = Subscription.EMPTY;
  profile: UserInterface|null = null;
  profileImage: string = 'assets/images/blank-profile.png';

  constructor(
    private _overlay: Overlay,
    private _snackBar: MatSnackBar,
    private _verto: VertoService,
    private _arweave: ArweaveService,
    private _auth: UserAuthService) {
    this.codemirrorWrapper = new CodeMirrorWrapper();
  }

  ngOnInit(): void {
    const account = this._auth.getMainAddressSnapshot();
    this.loadingData = true;
    this.profileSubscription = this._verto.getProfile(account).subscribe({
        next: (profile: UserInterface|undefined) => {
          if (profile) {
            if (profile.image) {
              this.profileImage = `${this._arweave.baseURL}${profile.image}`;
            }
          } else {
            this.profile = null;
            this.profileImage = 'assets/images/blank-profile.png';
          }
          this.loadingData = false;
        },
        error: (error) => {
          this.loadingData = false;
          this.message(error, 'error');
        }
      });
  }


  openEmojiMenu() {
    const emojiMenu = document.getElementsByClassName('fa fa-smile-o')[0];
    if (!emojiMenu) {
      throw Error('EmojiMenu not available');
    }
    const positionStrategy = this._overlay.position().flexibleConnectedTo(emojiMenu).withPositions([
       {
         originX: 'end',
         originY: 'top',
         overlayX: 'center',
         overlayY: 'top',
         offsetY: 32
       }
     ]);

    this.overlayRef = this._overlay.create({
      hasBackdrop: true,
      disposeOnNavigation: true,
      scrollStrategy: this._overlay.scrollStrategies.close(),
      positionStrategy
    });

    this.emojisPortal = new ComponentPortal(EmojisComponent);
    this.overlayRef!.attach(this.emojisPortal);

    this.overlayRef.overlayElement.addEventListener('click', (event) => {
      // Set editors value 

      // Close menu
      this.closeEmojiMenu();
    });

    this.overlayRef!.backdropClick().subscribe(() => {
      this.closeEmojiMenu();
    });
    
  }

  closeEmojiMenu() {
    this.overlayRef!.dispose();
  }

  ngAfterViewInit() {
    this.loading = true;
    
    this.loadEditorSubscription = this.codemirrorWrapper.init(this.postMessage.nativeElement).subscribe({
      next: (res) => {
        // Done
      this.loading = false;

      },
      error: (error) => {
        this.loading = false;
        this.message(error, 'error');
      }
    });
    
  }

  ngOnDestroy() {
    this.loadEditorSubscription.unsubscribe();
    this.profileSubscription.unsubscribe();
  }

  /*
  *  Custom snackbar message
  */
  message(msg: string, panelClass: string = '', verticalPosition: any = undefined) {
    this._snackBar.open(msg, 'X', {
      duration: 8000,
      horizontalPosition: 'center',
      verticalPosition: verticalPosition,
      panelClass: panelClass
    });
  }

}
