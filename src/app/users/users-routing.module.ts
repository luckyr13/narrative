import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { StoryComponent } from './story/story.component';
import { LatestStoriesComponent } from './latest-stories/latest-stories.component';

const routes: Routes = [
	{
		path: '',
		component: ProfileComponent,
		children: [
			{
				path: ':id', component: StoryComponent
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
