import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoriesRoutingModule } from './stories-routing.module';
import { StoriesComponent } from './stories.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    StoriesComponent
  ],
  imports: [
    CommonModule,
    StoriesRoutingModule,
    SharedModule
  ]
})
export class StoriesModule { }
