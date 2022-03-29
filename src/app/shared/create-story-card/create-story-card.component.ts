import { 
  Component, OnInit, ElementRef, OnDestroy, AfterViewInit,
  ViewChild, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Observable, Subscription, of } from 'rxjs';
import { CodeMirrorWrapper } from '../../core/classes/codemirror-wrapper';
import { UserInterface } from '@verto/js/dist/common/faces';
import { ArweaveService } from '../../core/services/arweave.service';
import { VertoService } from '../../core/services/verto.service';
import { UserAuthService } from '../../core/services/user-auth.service';
import { StoryService } from '../../core/services/story.service';
import { UserSettingsService } from '../../core/services/user-settings.service';
import { UtilsService } from '../../core/utils/utils.service';

@Component({
  selector: 'app-create-story-card',
  templateUrl: './create-story-card.component.html',
  styleUrls: ['./create-story-card.component.scss']
})
export class CreateStoryCardComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {
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
  isDarkTheme = false;
  themeSubscription = Subscription.EMPTY;
  @Input('account') account!: string;
  @Output('newStoryEvent') newStoryEvent = new EventEmitter<string>();

  constructor(
    private _verto: VertoService,
    private _arweave: ArweaveService,
    private _auth: UserAuthService,
    private _story: StoryService,
    private _userSettings: UserSettingsService,
    private _utils: UtilsService) {
    this.codemirrorWrapper = new CodeMirrorWrapper();
  }

  ngOnInit(): void {
    this.contentSubscription = this.codemirrorWrapper.contentStream.subscribe((content) => {
      this.messageContent = content;
    });
    this.isDarkTheme = this._userSettings.isDarkTheme(this._userSettings.getDefaultTheme());
    this.themeSubscription = this._userSettings.currentThemeStream.subscribe((theme) => {
      this.isDarkTheme = this._userSettings.isDarkTheme(theme);
    });
  }


  openEmojiMenu() {
    
  }

  closeEmojiMenu() {
    
  }

  loadVertoProfile(account: string) {
    this.loadingData = true;
    this.profileImage = 'assets/images/blank-profile.png';
    this.nickname = '';
    const accountEllipsis = this._utils.ellipsis(account);
    this.codemirrorWrapper.updatePlaceholder(`What\'s on your mind ${accountEllipsis}?`);

    this.profileSubscription = this._verto.getProfile(account).subscribe({
        next: (profile: UserInterface|undefined) => {
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
          this._utils.message(error, 'error');
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
        this._utils.message(error, 'error');
      },
      complete: () => {
        this.loadVertoProfile(this.account);
      }
    });
    
  }

  ngOnDestroy() {
    this.loadEditorSubscription.unsubscribe();
    this.profileSubscription.unsubscribe();
    this.contentSubscription.unsubscribe();
    this.createPostSubscription.unsubscribe();
    this.codemirrorWrapper.destroy();
  }

  submit() {
    this.loadingCreatePost = true;
    this.codemirrorWrapper.editable(false);

    this.createPostSubscription = this._story.createPost(this.messageContent).subscribe({
      next: (tx) => {
        this.loadingCreatePost = false;
        this.codemirrorWrapper.resetEditor();
        this.codemirrorWrapper.editable(true);
        if (!tx || !tx.id) {
          this._utils.message('Error creating tx!', 'error');
          return;
        }
        this._utils.message('Success!', 'success');
        this.newStoryEvent.emit(tx.id);    
      },
      error: (error) => {
        this._utils.message(error, 'error');
        this.loadingCreatePost = false;
        this.codemirrorWrapper.editable(true);
    
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['account'].previousValue != this.account) {
      this.loadVertoProfile(changes['account'].currentValue);
    }
  }

  emojiSelected(s: string) {
    if (s) {
      this.codemirrorWrapper.insertText(s);
    }
  }

}
