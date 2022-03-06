import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotificationsRoutingModule } from './notifications-routing.module';
import { NotificationsComponent } from './notifications.component';
import { SharedModule } from '../shared/shared.module';
import { PendingComponent } from './pending/pending.component';
import { HistoryComponent } from './history/history.component';


@NgModule({
  declarations: [
    NotificationsComponent,
    PendingComponent,
    HistoryComponent
  ],
  imports: [
    CommonModule,
    NotificationsRoutingModule,
    SharedModule
  ]
})
export class NotificationsModule { }
