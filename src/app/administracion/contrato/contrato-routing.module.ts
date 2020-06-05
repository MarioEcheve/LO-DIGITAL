import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ContratoComponent } from "./contrato/contrato.component";
import { ListaContratoComponent } from "./lista-contrato/lista-contrato.component";
import { DetalleContratoComponent } from "./detalle-contrato/detalle-contrato.component";

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "contrato",
        component: ContratoComponent,
      },
      {
        path: "lista-contrato",
        component: ListaContratoComponent,
      },
      {
        path: "detalle-contrato",
        component: DetalleContratoComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContratoRoutingModule {}
