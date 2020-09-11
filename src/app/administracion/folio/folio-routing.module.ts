import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { FolioComponent } from "./folio/folio.component";
import { FolioBorradorComponent } from "./folio-borrador/folio-borrador.component";
import { FolioFirmadoComponent } from "./folio-firmado/folio-firmado.component";
import { ArchivoComponent } from "./archivo/archivo.component";
import { FolioDetalleComponent } from "./folio-detalle/folio-detalle.component";

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "folio",
        component: FolioComponent,
      },
      {
        path: "folio/:id/:idLibro",
        component: FolioComponent,
      },
      {
        path: "folio-borrador/:id/:idUsuario",
        component: FolioBorradorComponent,
      },
      {
        path: "folio-firmado",
        component: FolioFirmadoComponent,
      },
      {
        path: "folio- /:id",
        component: FolioFirmadoComponent,
      },
      {
        path: "folio-detalle/:id",
        component: FolioDetalleComponent,
      },
      {
        path: "folio-archivo",
        component: ArchivoComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FolioRoutingModule {}
