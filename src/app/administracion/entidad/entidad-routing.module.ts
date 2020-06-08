import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { EntidadComponent } from "./entidad/entidad.component";

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "entidad",
        component: EntidadComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EntidadRoutingModule {}
