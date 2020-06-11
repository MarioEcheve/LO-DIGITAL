import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { UsuarioComponent } from "./usuario/usuario.component";
import { EditarUsuarioComponent } from "./editar-usuario/editar-usuario.component";
import { SettingUsuarioComponent } from "./setting-usuario/setting-usuario.component";
import { CambioPasswordUsuarioComponent } from "./cambio-password-usuario/cambio-password-usuario.component";

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "usuario",
        component: UsuarioComponent,
      },
      {
        path: "editar-usuario",
        component: EditarUsuarioComponent,
      },
      {
        path: "setting-usuario",
        component: SettingUsuarioComponent,
      },
      {
        path: "cambio-passwrod-usuario",
        component: CambioPasswordUsuarioComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsuarioRoutingModule {}
