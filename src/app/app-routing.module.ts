import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { InitPlatformAuthGuard } from './core/route-guards/init-platform-auth.guard';

const routes: Routes = [
	{
		path: 'home',
		loadChildren: () => import('./home/home.module').then(m => m.HomeModule), 
		canActivate: [InitPlatformAuthGuard]
	},
	{ path: '', pathMatch: 'full', redirectTo: 'home' },
	{
		path: '',
		loadChildren: () => import('./panel/panel.module').then(m => m.PanelModule),
		canActivate: [InitPlatformAuthGuard]
	},
	{
		path: '**',
		loadChildren: () => import('./page-not-found/page-not-found.module').then(m => m.PageNotFoundModule), 
		canActivate: [InitPlatformAuthGuard]
	},
];

@NgModule({
  imports: [
  	RouterModule.forRoot(routes,
	  {
	    preloadingStrategy: PreloadAllModules,
	    useHash: true
	  })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
