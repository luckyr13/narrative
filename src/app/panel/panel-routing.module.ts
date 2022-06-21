import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogoutComponent } from './logout/logout.component';

const routes: Routes = [
	{
		path: 'settings',
		loadChildren: () => import('../settings/settings.module').then(m => m.SettingsModule)
	},
	{ path: 'search', loadChildren: () => import('../search/search.module').then(m => m.SearchModule) },
	{
		path: 'logout', component: LogoutComponent
	},
	{ path: ':address', loadChildren: () => import('../users/users.module').then(m => m.UsersModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PanelRoutingModule { }
