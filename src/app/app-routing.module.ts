import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { InitPlatformGuard } from './core/route-guards/init-platform.guard';

const routes: Routes = [
	{
		path: 'home',
		loadChildren: () => import('./home/home.module').then(m => m.HomeModule), 
		canActivate: [InitPlatformGuard]
	},
	{ path: '', pathMatch: 'full', redirectTo: 'home' },
	{
		path: '',
		loadChildren: () => import('./panel/panel.module').then(m => m.PanelModule),
		canActivate: [InitPlatformGuard]
	},
	{
		path: '**',
		loadChildren: () => import('./page-not-found/page-not-found.module').then(m => m.PageNotFoundModule), 
		canActivate: [InitPlatformGuard]
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
