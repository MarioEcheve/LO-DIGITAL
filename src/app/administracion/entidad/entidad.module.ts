import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EntidadRoutingModule } from './entidad-routing.module';
import { EntidadComponent } from './entidad/entidad.component';


@NgModule({
  declarations: [EntidadComponent],
  imports: [
    CommonModule,
    EntidadRoutingModule
  ]
})
export class EntidadModule { }
