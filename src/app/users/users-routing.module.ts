import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { StoryComponent } from './story/story.component';
import { LatestStoriesComponent } from './latest-stories/latest-stories.component';
import { ProfileResolverService } from '../core/route-guards/profile-resolver.service';

const routes: Routes = [
	{
		path: '',
		component: ProfileComponent,
		resolve: {
			profile: ProfileResolverService
		},
		children: [
			{
				path: ':storyId', component: StoryComponent, resolve: {profile: ProfileResolverService}
			},
			{
				path: '', component: LatestStoriesComponent, pathMatch: 'full'
			},
		]
	},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
