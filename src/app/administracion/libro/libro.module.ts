import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { LibroRoutingModule } from "./libro-routing.module";
import { LibroComponent } from "./libro/libro.component";
import { DetalleLibroComponent } from "./detalle-libro/detalle-libro.component";
import { ListaLibroComponent } from "./lista-libro/lista-libro.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NouisliderModule } from "ng2-nouislider";
import { TagInputModule } from "ngx-chips";
import { MaterialModule } from "src/app/app.module";

@NgModule({
  declarations: [LibroComponent, DetalleLibroComponent, ListaLibroComponent],
  imports: [
    CommonModule,
    LibroRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NouisliderModule,
    TagInputModule,
    MaterialModule,
  ],
})
export class LibroModule {}
