import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { FilmListComponent } from './film-list/film-list.component';
import { FilmFormComponent } from './film-form/film-form.component';

const routes: Routes = [
  { path: '', component: FilmListComponent },
  { path: 'new', component: FilmFormComponent },
  { path: 'edit/:id', component: FilmFormComponent }
];

@NgModule({
  declarations: [
    FilmListComponent,
    FilmFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class FilmModule { }
