import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PanelComponent } from './panel.component';
import { LogoutComponent } from './logout/logout.component';


const routes: Routes = [
	{
		path: '',
		children: [
			{ path: 'settings', loadChildren: () => import('../settings/settings.module').then(m => m.SettingsModule) },
			{ path: 'stories', loadChildren: () => import('../stories/stories.module').then(m => m.StoriesModule) },
			{ path: 'notifications', loadChildren: () => import('../notifications/notifications.module').then(m => m.NotificationsModule) },
			{ path: 'friends', loadChildren: () => import('../friends/friends.module').then(m => m.FriendsModule) },
			{
				path: 'logout', component: LogoutComponent
			},
			
			{ path: ':address', loadChildren: () => import('../users/users.module').then(m => m.UsersModule) },
			
		]
	},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PanelRoutingModule { }
