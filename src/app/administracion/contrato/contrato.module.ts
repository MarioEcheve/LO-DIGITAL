import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ContratoRoutingModule } from "./contrato-routing.module";
import { ContratoComponent } from "./contrato/contrato.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NouisliderModule } from "ng2-nouislider";
import { TagInputModule } from "ngx-chips";
import { MaterialModule } from "src/app/app.module";

@NgModule({
  declarations: [ContratoComponent],
  imports: [
    CommonModule,
    ContratoRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NouisliderModule,
    TagInputModule,
    MaterialModule,
  ],
})
export class ContratoModule {}
