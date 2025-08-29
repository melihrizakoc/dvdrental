import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActorListComponent } from './actor-list/actor-list.component';
import { ActorFormComponent } from './actor-form/actor-form.component';

const routes: Routes = [
  { path: '', component: ActorListComponent },
  { path: 'new', component: ActorFormComponent },
  { path: 'edit/:id', component: ActorFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActorRoutingModule { }

