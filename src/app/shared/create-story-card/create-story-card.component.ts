import { 
  Component, OnInit, ElementRef, OnDestroy, AfterContentInit,
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
import {MatDialog} from '@angular/material/dialog';
import {MatMenuTrigger} from '@angular/material/menu';
import {MatButton} from '@angular/material/button';
import { NewStoryDialogComponent } from '../new-story-dialog/new-story-dialog.component'; 
import { SearchStoryDialogComponent } from '../search-story-dialog/search-story-dialog.component';
import { FileManagerDialogComponent } from '../file-manager-dialog/file-manager-dialog.component'; 
import { UploadFileDialogComponent } from '../upload-file-dialog/upload-file-dialog.component';
import { SubmitStoryDialogComponent } from '../submit-story-dialog/submit-story-dialog.component';
import Transaction from 'arweave/web/lib/transaction';
import { ArbundlesService } from '../../core/services/arbundles.service';

@Component({
  selector: 'app-create-story-card',
  templateUrl: './create-story-card.component.html',
  styleUrls: ['./create-story-card.component.scss']
})
export class CreateStoryCardComponent implements OnInit, OnDestroy, AfterContentInit, OnChanges {
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
  @ViewChild('matButtonImage') matButtonImage!: MatButton;
  @Input('isSubstory') isSubstory!: boolean;
  substories: any[] = [];
  unsignedTxSubscription = Subscription.EMPTY;

  constructor(
    private _verto: VertoService,
    private _arweave: ArweaveService,
    private _auth: UserAuthService,
    private _story: StoryService,
    private _userSettings: UserSettingsService,
    private _utils: UtilsService,
    private _dialog: MatDialog,
    private _arbundles: ArbundlesService) {
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

  ngAfterContentInit() {
    this.loading = true;
    this.loadEditorSubscription = this.codemirrorWrapper.init(
      this.postMessage.nativeElement
    ).subscribe({
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
    this.unsignedTxSubscription.unsubscribe();
  }

  submitSubstory() {
    this.loadingCreatePost = true;
    this.newStoryEvent.emit(this.messageContent);
    this.substories = [];
  }

  submit() {
    if (this.isSubstory) {
      this.submitSubstory();
      return;
    }

    this.loadingCreatePost = true;
    this.codemirrorWrapper.editable(false);


    const dialogRef = this._dialog.open(
      SubmitStoryDialogComponent,
      {
        restoreFocus: false,
        autoFocus: false,
        disableClose: true,
        data: {
          address: this.account,
          substories: this.substories,
          mainStory: this.messageContent
        }
      }
    );

    dialogRef.afterClosed().subscribe((mainTx: string) => {
      if (mainTx) {
        this.loadingCreatePost = false;
        this.codemirrorWrapper.resetEditor();
        this.codemirrorWrapper.editable(true);
        this._utils.message('Success!', 'success');
        this.newStoryEvent.emit(mainTx);
        this.substories = [];
      } else {
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

  fileManager(type: string) {
    const dialogRef = this._dialog.open(
      FileManagerDialogComponent,
      {
        restoreFocus: false,
        autoFocus: false,
        disableClose: true,
        data: {
          type: type,
          address: this.account
        }
      });

    // Manually restore focus to the menu trigger
    dialogRef.afterClosed().subscribe((tx: string) => { 
      this.matButtonImage.focus();
      if (tx) {
        const ids = this.substories.map((v) => {
          return v.arrId;
        });
        const maxId = ids && ids.length ? Math.max(...ids) + 1 : 0;
        const newId = this.substories.push({
          id: tx,
          type: 'image',
          arrId: maxId
        });
      }
    });
  }

  uploadFile(type: string) {
    const dialogRef = this._dialog.open(
      UploadFileDialogComponent,
      {
        restoreFocus: false,
        autoFocus: true,
        disableClose: true,
        data: {
          type: type,
          address: this.account
        }
      }
    );

    // Manually restore focus to the menu trigger
    dialogRef.afterClosed().subscribe((tx: string) => {
      this.matButtonImage.focus();
      if (tx) {
        const ids = this.substories.map((v) => {
          return v.arrId;
        });
        const maxId = ids && ids.length ? Math.max(...ids) + 1 : 0;
        const newId = this.substories.push({
          id: tx,
          type: 'image',
          arrId: maxId
        });
      }
    });
  }

  addSubstory() {
    const dialogRef = this._dialog.open(
      NewStoryDialogComponent,
      {
        restoreFocus: false,
        autoFocus: false,
        disableClose: true,
        data: {
          address: this.account
        }
      }
    );

    dialogRef.afterClosed().subscribe((content: string) => {
      if (content) {
        const ids = this.substories.map((v) => {
          return v.arrId;
        });
        const maxId = ids && ids.length ? Math.max(...ids) + 1 : 0;
        this.substories.push({
          id: '',
          content: content,
          type: 'text',
          arrId: maxId
        });
      }
    });
  }

  searchStory() {
    const dialogRef = this._dialog.open(
      SearchStoryDialogComponent,
      {
        restoreFocus: false,
        autoFocus: false,
        disableClose: true,
        data: {
          type: 'image',
          address: this.account
        }
      }
    );

    // Manually restore focus to the menu trigger
    dialogRef.afterClosed().subscribe(() => {});
  }

  getImgUrlFromTx(tx: string) {
    return `${this._arweave.baseURL}${tx}`;
  }

  getSubstoriesFiltered(filter: string) {
    return this.substories.filter((s) => {
      return s.type === filter;
    });
  }

  deleteSubstory(arrId: string) {
    const i = this.substories.findIndex((s) => {
      return s.arrId === arrId;
    });

    if (i === undefined) {
      return;
    }

    this.substories.splice(i, 1);
  }

  comingSoon() {
    alert('Coming soon!');
  }

}
