import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AngularEditorModule } from "@kolkov/angular-editor";
import { FolioRoutingModule } from "./folio-routing.module";
import { FolioComponent } from "./folio/folio.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NouisliderModule } from "ng2-nouislider";
import { TagInputModule } from "ngx-chips";
import { MaterialModule } from "src/app/app.module";
import { FolioBorradorComponent } from './folio-borrador/folio-borrador.component';
import { FolioFirmadoComponent } from './folio-firmado/folio-firmado.component';

@NgModule({
  declarations: [FolioComponent, FolioBorradorComponent, FolioFirmadoComponent],
  imports: [
    CommonModule,
    FolioRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NouisliderModule,
    TagInputModule,
    MaterialModule,
    AngularEditorModule,
  ],
})
export class FolioModule {}
