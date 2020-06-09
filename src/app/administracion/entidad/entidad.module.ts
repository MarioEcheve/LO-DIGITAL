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

@NgModule({
  declarations: [
    EntidadComponent,
    UsuarioEntidadComponent,
    NuevaEntidadComponent,
  ],
  imports: [
    CommonModule,
    EntidadRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NouisliderModule,
    TagInputModule,
    MaterialModule,
  ],
})
export class EntidadModule {}
