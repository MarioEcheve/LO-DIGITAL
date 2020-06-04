import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContratoComponent } from './contrato/contrato.component';


const routes: Routes = [
  {
    path: '',
    children: [ {
      path: 'contrato',
      component: ContratoComponent
  }]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContratoRoutingModule { }
