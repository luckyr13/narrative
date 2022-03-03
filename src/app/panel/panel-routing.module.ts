import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogoutComponent } from './logout/logout.component';
import { InitPlatformAuthGuard } from '../core/route-guards/init-platform-auth.guard';

const routes: Routes = [
	{
		path: 'settings',
		loadChildren: () => import('../settings/settings.module').then(m => m.SettingsModule)
	},
	{
		path: '',
		canActivateChild: [InitPlatformAuthGuard],
		children: [
			{ path: 'stories', loadChildren: () => import('../stories/stories.module').then(m => m.StoriesModule) },
			{ path: 'notifications', loadChildren: () => import('../notifications/notifications.module').then(m => m.NotificationsModule) },
			{ path: 'friends', loadChildren: () => import('../friends/friends.module').then(m => m.FriendsModule) },
			{
				path: 'logout', component: LogoutComponent
			},
		],
	},
	{ path: ':address', loadChildren: () => import('../users/users.module').then(m => m.UsersModule) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PanelRoutingModule { }
