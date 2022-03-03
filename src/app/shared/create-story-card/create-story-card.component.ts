import { Component, OnInit, ElementRef, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { Observable, Subscription, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CodeMirrorWrapper } from '../../core/classes/codemirror-wrapper';
import { UserInterface } from '@verto/js/dist/faces';
import { ArweaveService } from '../../core/services/arweave.service';
import { VertoService } from '../../core/services/verto.service';
import { UserAuthService } from '../../core/services/user-auth.service';
import { StoryService } from '../../core/services/story.service';

@Component({
  selector: 'app-create-story-card',
  templateUrl: './create-story-card.component.html',
  styleUrls: ['./create-story-card.component.scss']
})
export class CreateStoryCardComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('postMessage', {static: true}) postMessage!: ElementRef;
  loading: boolean = true;
  loadEditorSubscription: Subscription = Subscription.EMPTY;
  codemirrorWrapper: CodeMirrorWrapper;
  loadingData = false;
  profileSubscription: Subscription = Subscription.EMPTY;
  profileImage: string = 'assets/images/blank-profile.png';
  nickname: string = '';
  messageContent: string = '';
  contentSubscription: Subscription = Subscription.EMPTY;
  loadingCreatePost = false;
  createPostSubscription: Subscription = Subscription.EMPTY;

  constructor(
    private _snackBar: MatSnackBar,
    private _verto: VertoService,
    private _arweave: ArweaveService,
    private _auth: UserAuthService,
    private _story: StoryService) {
    this.codemirrorWrapper = new CodeMirrorWrapper();
  }

  ngOnInit(): void {
    this.contentSubscription = this.codemirrorWrapper.contentStream.subscribe((content) => {
      this.messageContent = content;
    });
  }


  openEmojiMenu() {
    
  }

  closeEmojiMenu() {
    
  }

  loadVertoProfile() {
    const account = this._auth.getMainAddressSnapshot();
    this.loadingData = true;
    this.profileSubscription = this._verto.getProfile(account).subscribe({
        next: (profile: UserInterface|undefined) => {
          this.profileImage = 'assets/images/blank-profile.png';
          this.nickname = '';

          if (profile) {
            if (profile.image) {
              this.profileImage = `${this._arweave.baseURL}${profile.image}`;
            }
            if (profile.username) {
              this.nickname = profile.username;
              this.codemirrorWrapper.updatePlaceholder(`What\'s on your mind ${this.nickname}?`);

            }
          }
          this.loadingData = false;
        },
        error: (error) => {
          this.loadingData = false;
          this.message(error, 'error');
        }
      });
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
      },
      complete: () => {
        this.loadVertoProfile();
      }
    });
    
  }

  ngOnDestroy() {
    this.loadEditorSubscription.unsubscribe();
    this.profileSubscription.unsubscribe();
    this.contentSubscription.unsubscribe();
    this.createPostSubscription.unsubscribe();
  }

  submit() {
    this.loadingCreatePost = true;
    this.createPostSubscription = this._story.createPost(this.messageContent).subscribe({
      next: (tx) => {
        
        console.log('tx', tx)
        this.loadingCreatePost = false;
      },
      error: (error) => {
        this.message(error, 'error');
        this.loadingCreatePost = false;
      }
    });
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
