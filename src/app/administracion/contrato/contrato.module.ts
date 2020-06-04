import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContratoRoutingModule } from './contrato-routing.module';
import { ContratoComponent } from './contrato/contrato.component';


@NgModule({
  declarations: [ContratoComponent],
  imports: [
    CommonModule,
    ContratoRoutingModule
  ]
})
export class ContratoModule { }
