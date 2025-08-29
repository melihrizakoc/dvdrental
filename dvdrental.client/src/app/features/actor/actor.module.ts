import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ActorRoutingModule } from './actor-routing.module';
import { ActorListComponent } from './actor-list/actor-list.component';
import { ActorFormComponent } from './actor-form/actor-form.component';

@NgModule({
  declarations: [
    ActorListComponent,
    ActorFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ActorRoutingModule
  ]
})
export class ActorModule { }
