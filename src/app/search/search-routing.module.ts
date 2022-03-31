import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchComponent } from './search.component';
import { ResultsComponent } from './results/results.component';

const routes: Routes = [
  {
    path: '',
    component: SearchComponent,
    children: [
      { path: ':query', component: ResultsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchRoutingModule { }
