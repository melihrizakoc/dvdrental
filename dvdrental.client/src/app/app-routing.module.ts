import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./features/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'actors',
    loadChildren: () => import('./features/actor/actor.module').then(m => m.ActorModule)
  },
  {
    path: 'categories',
    loadChildren: () => import('./features/category/category.module').then(m => m.CategoryModule)
  },
  {
    path: 'films',
    loadChildren: () => import('./features/film/film.module').then(m => m.FilmModule)
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
