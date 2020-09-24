import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { EntidadRoutingModule } from "./entidad-routing.module";
import { EntidadComponent } from "./entidad/entidad.component";
import { UsuarioEntidadComponent } from "./usuario-entidad/usuario-entidad.component";
import { NuevaEntidadComponent } from "./nueva-entidad/nueva-entidad.component";
import { MaterialModule } from "src/app/app.module";
import { TagInputModule } from "ngx-chips";
import { NouisliderModule } from "ng2-nouislider";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { DetalleEntidadComponent } from './detalle-entidad/detalle-entidad.component';
import { NgxPermissionsModule } from "ngx-permissions";
import { ModalUsuarioComponent } from './modal-usuario/modal-usuario.component';

@NgModule({
  declarations: [
    EntidadComponent,
    UsuarioEntidadComponent,
    NuevaEntidadComponent,
    DetalleEntidadComponent,
    ModalUsuarioComponent
  ],
  imports: [
    CommonModule,
    EntidadRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NouisliderModule,
    TagInputModule,
    MaterialModule,
    NgxPermissionsModule.forRoot(),
  ],
  entryComponents : [ ModalUsuarioComponent ]
})
export class EntidadModule {}
