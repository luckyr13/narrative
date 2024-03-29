import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { BottomSheetLoginComponent } from './bottom-sheet-login/bottom-sheet-login.component';
import {MatListModule} from '@angular/material/list';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatDividerModule} from '@angular/material/divider';
import {MatCardModule} from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatMenuModule} from '@angular/material/menu';
import {MatRadioModule} from '@angular/material/radio';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import {OverlayModule} from '@angular/cdk/overlay';
import {PortalModule} from '@angular/cdk/portal';
import {MatRippleModule} from '@angular/material/core';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { EmojisComponent } from './emojis/emojis.component';
import { CreateStoryCardComponent } from './create-story-card/create-story-card.component';
import { StoryCardComponent } from './story-card/story-card.component';
import {RouterModule} from '@angular/router';
import {MatTabsModule} from '@angular/material/tabs';
import {MatTooltipModule} from '@angular/material/tooltip';
import { ArweaveAddressComponent } from './arweave-address/arweave-address.component';
import {MatDialogModule} from '@angular/material/dialog';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { BottomSheetShareComponent } from './bottom-sheet-share/bottom-sheet-share.component';
import { StoryPlayerComponent } from './story-player/story-player.component';
import { NewStoryDialogComponent } from './new-story-dialog/new-story-dialog.component';
import { SearchStoryDialogComponent } from './search-story-dialog/search-story-dialog.component';
import { FileManagerDialogComponent } from './file-manager-dialog/file-manager-dialog.component';
import { UploadFileDialogComponent } from './upload-file-dialog/upload-file-dialog.component';
import { SubmitStoryDialogComponent } from './submit-story-dialog/submit-story-dialog.component';
import { StoryPlayerSubstoryComponent } from './story-player-substory/story-player-substory.component';
import {TranslateModule} from '@ngx-translate/core';
import { FollowDialogComponent } from './follow-dialog/follow-dialog.component';
import { UserCardComponent } from './user-card/user-card.component';
import { DonateDialogComponent } from './donate-dialog/donate-dialog.component';
import {MatSliderModule} from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import { ReplyDialogComponent } from './reply-dialog/reply-dialog.component';
import { LikeDialogComponent } from './like-dialog/like-dialog.component';
import { RepostDialogComponent } from './repost-dialog/repost-dialog.component';
import { RecordVideoDialogComponent } from './record-video-dialog/record-video-dialog.component';
import { RecordAudioDialogComponent } from './record-audio-dialog/record-audio-dialog.component';
import { FilterDialogComponent } from './filter-dialog/filter-dialog.component';
import { PasswordDialogComponent } from './password-dialog/password-dialog.component';
import { ViewLikesDialogComponent } from './view-likes-dialog/view-likes-dialog.component';
import { ConfirmationDispatchDialogComponent } from './confirmation-dispatch-dialog/confirmation-dispatch-dialog.component';
import { EditProfileBannerComponent } from '../users/edit-profile-banner/edit-profile-banner.component';
import { CreateStoryDialogComponent } from './create-story-dialog/create-story-dialog.component';
import { ViewRepostsDialogComponent } from './view-reposts-dialog/view-reposts-dialog.component';
import { DialogCookiesMsgComponent } from './dialog-cookies-msg/dialog-cookies-msg.component';

@NgModule({
  declarations: [
    BottomSheetLoginComponent,
    EmojisComponent,
    CreateStoryCardComponent,
    StoryCardComponent,
    ArweaveAddressComponent,
    ConfirmationDialogComponent,
    BottomSheetShareComponent,
    StoryPlayerComponent,
    NewStoryDialogComponent,
    SearchStoryDialogComponent,
    FileManagerDialogComponent,
    UploadFileDialogComponent,
    SubmitStoryDialogComponent,
    StoryPlayerSubstoryComponent,
    FollowDialogComponent,
    UserCardComponent,
    DonateDialogComponent,
    ReplyDialogComponent,
    LikeDialogComponent,
    RepostDialogComponent,
    RecordVideoDialogComponent,
    RecordAudioDialogComponent,
    FilterDialogComponent,
    PasswordDialogComponent,
    ViewLikesDialogComponent,
    ConfirmationDispatchDialogComponent,
    EditProfileBannerComponent,
    CreateStoryDialogComponent,
    ViewRepostsDialogComponent,
    DialogCookiesMsgComponent
  ],
  imports: [
    CommonModule,
    MatListModule,
    MatCheckboxModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatIconModule,
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    NgxSkeletonLoaderModule,
    MatMenuModule,
    OverlayModule,
    PortalModule,
    MatRippleModule,
    RouterModule,
    MatTabsModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    TranslateModule,
    MatSliderModule,
    FormsModule
  ],
  exports: [
  	MatToolbarModule,
  	MatIconModule,
  	MatButtonModule,
  	MatSidenavModule,
    MatProgressBarModule,
    MatListModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatBottomSheetModule,
    MatDividerModule,
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatRadioModule,
    NgxSkeletonLoaderModule,
    OverlayModule,
    PortalModule,
    MatRippleModule,
    MatProgressSpinnerModule,
    CreateStoryCardComponent,
    StoryCardComponent,
    MatTabsModule,
    MatTooltipModule,
    ArweaveAddressComponent,
    MatDialogModule,
    TranslateModule,
    UserCardComponent
  ]
})
export class SharedModule { }
