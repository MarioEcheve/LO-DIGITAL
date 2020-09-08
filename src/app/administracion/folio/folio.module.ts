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
import { DROPZONE_CONFIG } from "ngx-dropzone-wrapper";
import { DropzoneConfigInterface } from "ngx-dropzone-wrapper";
import { ModalFirmaFolioComponent } from "./modal-firma-folio/modal-firma-folio.component";
import { FolioDetalleComponent } from "./folio-detalle/folio-detalle.component";
import { VisorPdfComponent } from "../shared/visor-pdf/visor-pdf/visor-pdf.component";
import { NgxExtendedPdfViewerModule } from "ngx-extended-pdf-viewer";
import { ModalCrearFolioComponent } from "./modal-crear-folio/modal-crear-folio.component";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { ModalBuscarFolioComponent } from './modal-buscar-folio/modal-buscar-folio.component';
import { TablaBuscarFoliosComponent } from './componentes/tabla-buscar-folios/tabla-buscar-folios.component';
import { FiltroFolioPersonalizadoComponent } from "../shared/filtro-folio-personalizado/filtro-folio-personalizado.component";
import { NgxPermissionsModule } from "ngx-permissions";

const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
  // Change this to your upload POST address:
  url: "https://httpbin.org/post",
  maxFilesize: 10,
};

@NgModule({
  declarations: [
    FolioComponent,
    FolioBorradorComponent,
    FolioFirmadoComponent,
    ArchivoComponent,
    ModalFirmaFolioComponent,
    FolioDetalleComponent,
    ModalCrearFolioComponent,
    ModalBuscarFolioComponent,
    TablaBuscarFoliosComponent,
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
    NgxExtendedPdfViewerModule,
    NgxPermissionsModule.forRoot(),
  ],
  providers: [
    {
      provide: DROPZONE_CONFIG,
      useValue: DEFAULT_DROPZONE_CONFIG,
    },
  ],
  entryComponents: [
    ModalFirmaFolioComponent,
    VisorPdfComponent,
    ModalCrearFolioComponent,
    ModalBuscarFolioComponent,
    FiltroFolioPersonalizadoComponent
  ],
})
export class FolioModule {}
