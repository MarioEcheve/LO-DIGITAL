import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LibroRoutingModule } from './libro-routing.module';
import { LibroComponent } from './libro/libro.component';


@NgModule({
  declarations: [LibroComponent],
  imports: [
    CommonModule,
    LibroRoutingModule
  ]
})
export class LibroModule { }
