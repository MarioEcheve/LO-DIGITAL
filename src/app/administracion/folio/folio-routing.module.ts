import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { FolioComponent } from "./folio/folio.component";
import { FolioBorradorComponent } from "./folio-borrador/folio-borrador.component";
import { FolioFirmadoComponent } from "./folio-firmado/folio-firmado.component";

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "folio",
        component: FolioComponent,
      },
      {
        path: "folio-borrador",
        component: FolioBorradorComponent,
      },
      {
        path: "folio-firmado",
        component: FolioFirmadoComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FolioRoutingModule {}
