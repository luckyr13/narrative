import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ProfileComponent } from './profile/profile.component';
import { StoryComponent } from './story/story.component';
import { LatestStoriesComponent } from './latest-stories/latest-stories.component';
import { RepliesComponent } from './replies/replies.component';
import { LikesComponent } from './likes/likes.component';
import { PendingComponent } from './pending/pending.component';
import { FollowersComponent } from './followers/followers.component';
import { FollowingComponent } from './following/following.component';


@NgModule({
  declarations: [
    ProfileComponent,
    StoryComponent,
    LatestStoriesComponent,
    RepliesComponent,
    LikesComponent,
    PendingComponent,
    FollowersComponent,
    FollowingComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    SharedModule
  ]
})
export class UsersModule { }
