import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DetalleEntidadComponent } from "./detalle-entidad/detalle-entidad.component";
import { EntidadComponent } from "./entidad/entidad.component";
import { NuevaEntidadComponent } from "./nueva-entidad/nueva-entidad.component";
import { UsuarioEntidadComponent } from "./usuario-entidad/usuario-entidad.component";

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "entidad",
        component: EntidadComponent,
      },
      {
        path: "usuario-entidad",
        component: UsuarioEntidadComponent,
      },
      {
        path: "nueva-entidad",
        component: NuevaEntidadComponent,
      },
      {
        path: "detalle-entidad/:id",
        component: DetalleEntidadComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EntidadRoutingModule {}
