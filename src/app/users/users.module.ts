import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ProfileComponent } from './profile/profile.component';


@NgModule({
  declarations: [
    ProfileComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    SharedModule
  ]
})
export class UsersModule { }
