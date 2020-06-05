import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { FolioComponent } from "./folio/folio.component";

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "folio",
        component: FolioComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FolioRoutingModule {}
