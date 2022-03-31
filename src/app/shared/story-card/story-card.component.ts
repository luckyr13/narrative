import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef} from '@angular/core';
import { TransactionMetadata } from '../../core/interfaces/transaction-metadata';
import { VertoService } from '../../core/services/verto.service';
import { Subscription, Observable } from 'rxjs';
import { UserAuthService } from '../../core/services/user-auth.service';
import { UserInterface } from '@verto/js/dist/common/faces';
import { ArweaveService } from '../../core/services/arweave.service';
import { UserSettingsService } from '../../core/services/user-settings.service';
import { UtilsService } from '../../core/utils/utils.service';


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

  constructor(
    private _verto: VertoService,
    private _auth: UserAuthService,
    private _arweave: ArweaveService,
    private _userSettings: UserSettingsService,
    private _utils: UtilsService) { }

  ngOnInit(): void {
    this.loadVertoProfile();
    if (this.post.blockTimestamp) {
      this.post.blockTimestamp = this.dateFormat(this.post.blockTimestamp);
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

    this.loadingContent = true;
    this.contentSubscription = this._arweave.getDataAsString(this.post.id).subscribe({
      next: (data: string|Uint8Array) => {
        this.loadingContent = false;
        this.content = this._utils.sanitize(`${data}`);
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

    this.isDarkTheme = this._userSettings.isDarkTheme(this._userSettings.getDefaultTheme());
    this.themeSubscription = this._userSettings.currentThemeStream.subscribe((theme) => {
      this.isDarkTheme = this._userSettings.isDarkTheme(theme);
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

  dateFormat(d: number|string){
    if (!d) {
      return '';
    }
    const prev = new Date(+d * 1000);
    const current = new Date();
    const millisecondsEllapsed = current.getTime() - prev.getTime(); 
    const seconds = Math.floor(millisecondsEllapsed / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    if (days) {
      const month = months[prev.getMonth()];
      const date = prev.getDate();
      const year = prev.getFullYear();
      const currentYear = current.getFullYear();
      if (currentYear === year) {
        return `${month} ${date}`;
      }
      return `${month} ${date}, ${year}`;
    } else if (hours) {
      return `${hours}h`;
    } else if (minutes) {
      return `${minutes}m`;
    } else if (seconds) {
      return `${seconds}s`;
    }


    return ``;
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
  }

}
