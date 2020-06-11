import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UsuarioRoutingModule } from "./usuario-routing.module";
import { UsuarioComponent } from "./usuario/usuario.component";
import { EditarUsuarioComponent } from "./editar-usuario/editar-usuario.component";
import { SettingUsuarioComponent } from "./setting-usuario/setting-usuario.component";
import { CambioPasswordUsuarioComponent } from "./cambio-password-usuario/cambio-password-usuario.component";
import { MaterialModule } from "src/app/app.module";
import { TagInputModule } from "ngx-chips";
import { NouisliderModule } from "ng2-nouislider";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";

@NgModule({
  declarations: [
    UsuarioComponent,
    EditarUsuarioComponent,
    SettingUsuarioComponent,
    CambioPasswordUsuarioComponent,
  ],
  imports: [
    CommonModule,
    UsuarioRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NouisliderModule,
    TagInputModule,
    MaterialModule,
  ],
})
export class UsuarioModule {}
