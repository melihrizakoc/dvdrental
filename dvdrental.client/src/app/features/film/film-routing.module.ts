import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FilmListComponent } from './film-list/film-list.component';
import { FilmFormComponent } from './film-form/film-form.component';

const routes: Routes = [
  { path: '', component: FilmListComponent },
  { path: 'new', component: FilmFormComponent },
  { path: 'edit/:id', component: FilmFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FilmRoutingModule { }
