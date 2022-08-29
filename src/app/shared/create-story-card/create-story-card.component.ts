import { 
  Component, OnInit, ElementRef, OnDestroy, AfterContentInit,
  ViewChild, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Observable, Subscription, of } from 'rxjs';
import { CodeMirrorWrapper } from '../../core/classes/codemirror-wrapper';
import { ArweaveService } from '../../core/services/arweave.service';
import { ProfileService } from '../../core/services/profile.service';
import { UserAuthService } from '../../core/services/user-auth.service';
import { StoryService } from '../../core/services/story.service';
import { UserSettingsService } from '../../core/services/user-settings.service';
import { UtilsService } from '../../core/utils/utils.service';
import {MatDialog} from '@angular/material/dialog';
import {MatMenuTrigger} from '@angular/material/menu';
import { NewStoryDialogComponent } from '../new-story-dialog/new-story-dialog.component'; 
import { SearchStoryDialogComponent } from '../search-story-dialog/search-story-dialog.component';
import { FileManagerDialogComponent } from '../file-manager-dialog/file-manager-dialog.component'; 
import { UploadFileDialogComponent } from '../upload-file-dialog/upload-file-dialog.component';
import { SubmitStoryDialogComponent } from '../submit-story-dialog/submit-story-dialog.component';
import Transaction from 'arweave/web/lib/transaction';
import {TranslateService} from '@ngx-translate/core';
import { RecordVideoDialogComponent } from '../record-video-dialog/record-video-dialog.component'; 
import { RecordAudioDialogComponent } from '../record-audio-dialog/record-audio-dialog.component'; 
import { Direction } from '@angular/cdk/bidi';
import { UserProfile } from '../../core/interfaces/user-profile';

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
  profileImage: string = 'assets/images/blank-profile.jpg';
  nickname: string = '';
  messageContent: string = '';
  contentSubscription: Subscription = Subscription.EMPTY;
  loadingCreatePost = false;
  createPostSubscription: Subscription = Subscription.EMPTY;
  isDarkTheme = false;
  themeSubscription = Subscription.EMPTY;
  @Input('account') account!: string;
  @Output('newStoryEvent') newStoryEvent = new EventEmitter<string>();
  @Output('contentChangeEvent') contentChangeEvent = new EventEmitter<string>();
  @Input('isSubstory') isSubstory!: boolean;
  @Input('showSubmitButton') showSubmitButton: boolean = true;
  substories: {id: string, content: string, type: 'text'|'image'|'audio'|'video'|'', arrId: number}[] = [];
  unsignedTxSubscription = Subscription.EMPTY;

  constructor(
    private _profile: ProfileService,
    private _arweave: ArweaveService,
    private _auth: UserAuthService,
    private _story: StoryService,
    private _userSettings: UserSettingsService,
    private _utils: UtilsService,
    private _dialog: MatDialog,
    private _translate: TranslateService) {
    this.codemirrorWrapper = new CodeMirrorWrapper();
  }

  ngOnInit(): void {
    this.contentSubscription = this.codemirrorWrapper.contentStream.subscribe((content) => {
      this.messageContent = content;
      this.contentChangeEvent.emit(content);
    });
    this.isDarkTheme = this._userSettings.isDarkTheme(this._userSettings.getDefaultTheme());
    this.themeSubscription = this._userSettings.currentThemeStream.subscribe((theme) => {
      this.isDarkTheme = this._userSettings.isDarkTheme(theme);
    });
  }

  loadProfile(account: string) {
    this.loadingData = true;
    this.profileImage = 'assets/images/blank-profile.jpg';
    this.nickname = '';
    account = account.trim();
    
    this.profileSubscription = this._profile.getProfileByAddress(account).subscribe({
        next: (profile) => {
          if (profile) {
            if (profile.avatarURL) {
              this.profileImage = profile.avatarURL;
            }
            if (profile.username) {
              this.nickname = profile.username;
              this._translate.get('GENERAL.CREATE_STORY.TXTAREA_LABEL', {value: this.nickname}).subscribe((res: string) => {
                this.codemirrorWrapper.updatePlaceholder(res);
              });
            } else {
              this._translate.get(
                'GENERAL.CREATE_STORY.TXTAREA_LABEL',
                { value: this._utils.ellipsis(account) }
              ).subscribe((res: string) => {
                this.codemirrorWrapper.updatePlaceholder(res);
              });
            }
          } else {
            this._translate.get(
              'GENERAL.CREATE_STORY.TXTAREA_LABEL',
              { value: this._utils.ellipsis(account) }
            ).subscribe((res: string) => {
              this.codemirrorWrapper.updatePlaceholder(res);
            });
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
        this.loadProfile(this.account);
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

    const defLang = this._userSettings.getDefaultLang();
    const defLangObj = this._userSettings.getLangObject(defLang);
    let direction: Direction = defLangObj && defLangObj.writing_system === 'LTR' ? 
      'ltr' : 'rtl';

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
        },
        direction: direction
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
      this.loadProfile(changes['account'].currentValue);
    }
  }

  emojiSelected(s: string) {
    if (s) {
      this.codemirrorWrapper.insertText(s);
    }
  }

  fileManager(type: string) {
    const defLang = this._userSettings.getDefaultLang();
    const defLangObj = this._userSettings.getLangObject(defLang);
    let direction: Direction = defLangObj && defLangObj.writing_system === 'LTR' ? 
      'ltr' : 'rtl';

    const dialogRef = this._dialog.open(
      FileManagerDialogComponent,
      {
        restoreFocus: false,
        autoFocus: false,
        disableClose: true,
        data: {
          type: type,
          address: this.account
        },
        direction: direction,
        width: '800px'
      });

    // Manually restore focus to the menu trigger
    dialogRef.afterClosed().subscribe((res: {id: string, type:'text'|'image'|'audio'|'video'|''}) => { 
      if (res) {
        const ids = this.substories.map((v) => {
          return v.arrId;
        });
        const maxId = ids && ids.length ? Math.max(...ids) + 1 : 0;
        const newId = this.substories.push({
          id: res.id,
          type: res.type,
          arrId: maxId,
          content: ''
        });
      }
    });
  }

  uploadFile(type: string) {
    const defLang = this._userSettings.getDefaultLang();
    const defLangObj = this._userSettings.getLangObject(defLang);
    let direction: Direction = defLangObj && defLangObj.writing_system === 'LTR' ? 
      'ltr' : 'rtl';

    const dialogRef = this._dialog.open(
      UploadFileDialogComponent,
      {
        restoreFocus: false,
        autoFocus: true,
        disableClose: true,
        data: {
          type: type,
          address: this.account
        },
        direction: direction,
        width: '800px'
      }
    );

    // Manually restore focus to the menu trigger
    dialogRef.afterClosed().subscribe((res: { id: string, type: 'text'|'image'|'audio'|'video'|'' }|null|undefined) => {
      if (res) {
        const ids = this.substories.map((v) => {
          return v.arrId;
        });
        const maxId = ids && ids.length ? Math.max(...ids) + 1 : 0;
        const newId = this.substories.push({
          id: res.id,
          type: res.type,
          arrId: maxId,
          content: ''
        });
      }
    });
  }

  addSubstory() {
    const defLang = this._userSettings.getDefaultLang();
    const defLangObj = this._userSettings.getLangObject(defLang);
    let direction: Direction = defLangObj && defLangObj.writing_system === 'LTR' ? 
      'ltr' : 'rtl';

    const dialogRef = this._dialog.open(
      NewStoryDialogComponent,
      {
        restoreFocus: false,
        autoFocus: false,
        disableClose: true,
        data: {
          address: this.account
        },
        direction: direction
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
    const defLang = this._userSettings.getDefaultLang();
    const defLangObj = this._userSettings.getLangObject(defLang);
    let direction: Direction = defLangObj && defLangObj.writing_system === 'LTR' ? 
      'ltr' : 'rtl';
    const dialogRef = this._dialog.open(
      SearchStoryDialogComponent,
      {
        restoreFocus: false,
        autoFocus: false,
        disableClose: true,
        data: {
          // address: this.account
        },
        direction: direction
      }
    );

    // Manually restore focus to the menu trigger
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        const ids = this.substories.map((v) => {
          return v.arrId;
        });
        const maxId = ids && ids.length ? Math.max(...ids) + 1 : 0;
        this.substories.push({
          id: res.tx,
          content: res.content,
          type: res.type,
          arrId: maxId
        });
      }
    });
  }

  getImgUrlFromTx(tx: string) {
    return `${this._arweave.baseURL}${tx}`;
  }

  getSubstoriesFiltered(filter: string) {
    return this.substories.filter((s) => {
      return s.type === filter;
    });
  }

  deleteSubstory(arrId: number) {
    const i = this.substories.findIndex((s) => {
      return s.arrId === arrId;
    });

    if (i === undefined) {
      return;
    }

    this.substories.splice(i, 1);
  }

  recordVideo() {
    const defLang = this._userSettings.getDefaultLang();
    const defLangObj = this._userSettings.getLangObject(defLang);
    let direction: Direction = defLangObj && defLangObj.writing_system === 'LTR' ? 
      'ltr' : 'rtl';

    const dialogRef = this._dialog.open(
      RecordVideoDialogComponent,
      {
        restoreFocus: false,
        autoFocus: false,
        disableClose: false,
        data: {
          address: this.account
        },
        direction: direction
      });

    dialogRef.afterClosed().subscribe((res: {id: string, type:'text'|'image'|'audio'|'video'|''}) => { 
      if (res) {
        const ids = this.substories.map((v) => {
          return v.arrId;
        });
        const maxId = ids && ids.length ? Math.max(...ids) + 1 : 0;
        const newId = this.substories.push({
          id: res.id,
          type: res.type,
          arrId: maxId,
          content: ''
        });
      }
    });
  }

  recordAudio() {
    const defLang = this._userSettings.getDefaultLang();
    const defLangObj = this._userSettings.getLangObject(defLang);
    let direction: Direction = defLangObj && defLangObj.writing_system === 'LTR' ? 
      'ltr' : 'rtl';

    const dialogRef = this._dialog.open(
      RecordAudioDialogComponent,
      {
        restoreFocus: false,
        autoFocus: false,
        disableClose: false,
        data: {
          address: this.account
        },
        direction: direction
      });

    dialogRef.afterClosed().subscribe((res: {id: string, type:'text'|'image'|'audio'|'video'|''}) => { 
      if (res) {
        const ids = this.substories.map((v) => {
          return v.arrId;
        });
        const maxId = ids && ids.length ? Math.max(...ids) + 1 : 0;
        const newId = this.substories.push({
          id: res.id,
          type: res.type,
          arrId: maxId,
          content: ''
        });
      }
    });
  }

}
