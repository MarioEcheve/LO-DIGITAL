import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LibroComponent } from "./libro/libro.component";
import { DetalleLibroComponent } from "./detalle-libro/detalle-libro.component";
import { ListaLibroComponent } from "./lista-libro/lista-libro.component";

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "nuevo-libro",
        component: LibroComponent,
      },
      {
        path: "nuevo-libro/:id",
        component: LibroComponent,
      },
      {
        path: "detalle-libro",
        component: DetalleLibroComponent,
      },
      {
        path: "lista-libro",
        component: ListaLibroComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LibroRoutingModule {}
