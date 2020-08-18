import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ContratoRoutingModule } from "./contrato-routing.module";
import { ContratoComponent } from "./contrato/contrato.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NouisliderModule } from "ng2-nouislider";
import { TagInputModule } from "ngx-chips";
import { MaterialModule } from "src/app/app.module";
import { ListaContratoComponent } from "./lista-contrato/lista-contrato.component";
import { DetalleContratoComponent } from "./detalle-contrato/detalle-contrato.component";
import { ModalBuscarEntidadComponent } from "./modal-buscar-entidad/modal-buscar-entidad.component";
import { NgxPermissionsModule } from "ngx-permissions";

@NgModule({
  declarations: [
    ContratoComponent,
    ListaContratoComponent,
    DetalleContratoComponent,
    ModalBuscarEntidadComponent,
  ],
  imports: [
    CommonModule,
    ContratoRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NouisliderModule,
    TagInputModule,
    MaterialModule,
    NgxPermissionsModule.forRoot(),
  ],
  entryComponents: [ModalBuscarEntidadComponent],
})
export class ContratoModule {}
