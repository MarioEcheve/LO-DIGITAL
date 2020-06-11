import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AngularEditorModule } from "@kolkov/angular-editor";
import { FolioRoutingModule } from "./folio-routing.module";
import { FolioComponent } from "./folio/folio.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NouisliderModule } from "ng2-nouislider";
import { TagInputModule } from "ngx-chips";
import { MaterialModule } from "src/app/app.module";
import { FolioBorradorComponent } from "./folio-borrador/folio-borrador.component";
import { FolioFirmadoComponent } from "./folio-firmado/folio-firmado.component";
import { NgxFileDropModule } from "ngx-file-drop";
import { ArchivoComponent } from "./archivo/archivo.component";
import { MatTableModule } from "@angular/material/table";
import { DropzoneModule } from "ngx-dropzone-wrapper";

@NgModule({
  declarations: [
    FolioComponent,
    FolioBorradorComponent,
    FolioFirmadoComponent,
    ArchivoComponent,
  ],
  imports: [
    CommonModule,
    FolioRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NouisliderModule,
    TagInputModule,
    MaterialModule,
    AngularEditorModule,
    NgxFileDropModule,
    MatTableModule,
    DropzoneModule,
  ],
})
export class FolioModule {}
