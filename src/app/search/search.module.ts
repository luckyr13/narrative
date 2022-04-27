import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchRoutingModule } from './search-routing.module';
import { SearchComponent } from './search.component';
import { SharedModule } from '../shared/shared.module';
import { ResultsComponent } from './results/results.component';
import { TrendingComponent } from './trending/trending.component';


@NgModule({
  declarations: [
    SearchComponent,
    ResultsComponent,
    TrendingComponent
  ],
  imports: [
    CommonModule,
    SearchRoutingModule,
    SharedModule
  ]
})
export class SearchModule { }
