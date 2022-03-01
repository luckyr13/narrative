import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
	{ path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomeModule) },
	{ path: '', pathMatch: 'full', redirectTo: 'home' },
	{ path: '', loadChildren: () => import('./panel/panel.module').then(m => m.PanelModule) },
	{ path: '**', loadChildren: () => import('./page-not-found/page-not-found.module').then(m => m.PageNotFoundModule) },
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
