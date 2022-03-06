import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotificationsComponent } from './notifications.component';
import { PendingComponent } from './pending/pending.component';
import { HistoryComponent } from './history/history.component';

const routes: Routes = [
	{
		path: '',
		component: NotificationsComponent,
		children: [
			{ path: 'history', component: HistoryComponent },
			{ path: 'pending', component: PendingComponent },
			{ path: '', pathMatch: 'full', redirectTo: 'pending' } 
		]
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotificationsRoutingModule { }
