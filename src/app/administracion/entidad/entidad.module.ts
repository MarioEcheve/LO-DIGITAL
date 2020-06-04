import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EntidadRoutingModule } from './entidad-routing.module';
import { EntidadComponent } from './entidad/entidad.component';
import { UsuarioEntidadComponent } from './usuario-entidad/usuario-entidad.component';


@NgModule({
  declarations: [EntidadComponent, UsuarioEntidadComponent],
  imports: [
    CommonModule,
    EntidadRoutingModule
  ]
})
export class EntidadModule { }
