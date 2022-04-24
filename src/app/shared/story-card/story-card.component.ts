import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef} from '@angular/core';
import { TransactionMetadata } from '../../core/interfaces/transaction-metadata';
import { VertoService } from '../../core/services/verto.service';
import { Subscription, Observable } from 'rxjs';
import { UserAuthService } from '../../core/services/user-auth.service';
import { UserInterface } from '@verto/js/dist/common/faces';
import { ArweaveService } from '../../core/services/arweave.service';
import { UserSettingsService } from '../../core/services/user-settings.service';
import { UtilsService } from '../../core/utils/utils.service';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import { BottomSheetShareComponent } from '../bottom-sheet-share/bottom-sheet-share.component';
import { Direction } from '@angular/cdk/bidi';

@Component({
  selector: 'app-story-card',
  templateUrl: './story-card.component.html',
  styleUrls: ['./story-card.component.scss']
})
export class StoryCardComponent implements OnInit, OnDestroy {
	@Input() post!: TransactionMetadata;
	loadingContent = false;
	loadingProfile = false;
	profileImage = 'assets/images/blank-profile.png';
  profileSubscription = Subscription.EMPTY;
  contentSubscription = Subscription.EMPTY;
  profile: UserInterface|null = null;
  content: string = '';
  isDarkTheme = false;
  themeSubscription = Subscription.EMPTY;
  @ViewChild('contentContainer') contentContainer!: ElementRef;
  detectedLinks: string[] = [];
  substories: string[] = [];

  constructor(
    private _verto: VertoService,
    private _auth: UserAuthService,
    private _arweave: ArweaveService,
    private _userSettings: UserSettingsService,
    private _utils: UtilsService,
    private _bottomSheetShare: MatBottomSheet) { }

  ngOnInit(): void {
    this.loadVertoProfile();
    this.loadContent();
    if (this.post.blockTimestamp) {
      this.post.blockTimestamp = this._utils.dateFormat(this.post.blockTimestamp);
    }
    this.isDarkTheme = this._userSettings.isDarkTheme(this._userSettings.getDefaultTheme());
    this.themeSubscription = this._userSettings.currentThemeStream.subscribe((theme) => {
      this.isDarkTheme = this._userSettings.isDarkTheme(theme);
    });
    this.extractTagsFromPost(this.post);
  }

  extractTagsFromPost(post: TransactionMetadata) {
    const tags = post.tags!;
    for (const t of tags) {
      if (t.name === 'Substory') {
        this.substories.push(t.value);
      }
    }
  }

  loadVertoProfile() {
    const account = this.post.owner;
    this.loadingProfile = true;
    this.profileSubscription = this._verto.getProfile(account).subscribe({
      next: (profile: UserInterface|undefined) => {
        this.profileImage = 'assets/images/blank-profile.png';
        
        if (profile) {
          if (profile.image) {
            this.profileImage = `${this._arweave.baseURL}${profile.image}`;
          }
          this.profile = profile;
        }
        this.loadingProfile = false;
      },
      error: (error) => {
        this.loadingProfile = false;
        this._utils.message(error, 'error');
      }
    });

   
  }

  ngOnDestroy() {
    this.contentSubscription.unsubscribe();
    this.profileSubscription.unsubscribe();
    this.themeSubscription.unsubscribe();
  }

  ellipsis(s: string) {
    return this._utils.ellipsis(s);
  }

  comment(event: MouseEvent) {
    event.stopPropagation();
  }

  repost(event: MouseEvent) {
    event.stopPropagation();
  }

  like(event: MouseEvent) {
    event.stopPropagation();
  }


  share(event: MouseEvent) {
    event.stopPropagation();
    const defLang = this._userSettings.getDefaultLang();
    // defLang.writing_system
    const defLangWritingSystem = 'LTR';
    let direction: Direction = defLangWritingSystem === 'LTR' ? 
      'ltr' : 'rtl';
    const tmpContent = this._utils.sanitizeFull(this.content);
    const limit = 200;
    const user = this.profile && this.profile.username ? 
      this.profile.username :
      this.post.owner;


    this._bottomSheetShare.open(BottomSheetShareComponent, {
      data: {
        title: 'Story from Narrative!',
        content: this._utils.sanitizeFull(`${tmpContent} ...`.substr(0, limit)),
        img: '',
        fullURL: `${this._utils.getBaseURL()}#/${user}/${this.post.id}`
      },
      direction: direction,
      ariaLabel: 'Share on social media'
    });

  }

  loadContent() {
    this.loadingContent = true;
    this.contentSubscription = this._arweave.getDataAsString(this.post.id).subscribe({
      next: (data: string|Uint8Array) => {
        this.loadingContent = false;
        this.content = this._utils.sanitize(`${data}`);
        const links = this._utils.getLinks(`${data}`);
        this.detectedLinks = links.map((val) => {
          return val.href;
        });
        
        window.setTimeout(() => {
          const aTags = this.contentContainer && this.contentContainer.nativeElement ? 
            this.contentContainer.nativeElement.getElementsByTagName('a') : [];
          for (const anchor of aTags) {
            anchor.addEventListener('click', (event: MouseEvent) => {
              event.stopPropagation();
            });
          }
        }, 400);
      },
      error: (error) => {
        this.loadingContent = false;
        this._utils.message(error, 'error');
      }
    });
  }

}
