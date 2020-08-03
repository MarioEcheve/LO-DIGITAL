import { Component, OnInit, Inject } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from "@angular/material/dialog";
import { FolioService } from '../../services/folio.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filtro-folio-personalizado',
  templateUrl: './filtro-folio-personalizado.component.html',
  styleUrls: ['./filtro-folio-personalizado.component.css']
})
export class FiltroFolioPersonalizadoComponent implements OnInit {
  formFiltro : FormGroup;
  emisor;
  criteriosBusqueda = {
    emisor : "",
    receptor : "",
    asunto : ""
  }
  constructor(public dialModalRef: MatDialogRef<FiltroFolioPersonalizadoComponent>, 
              @Inject(MAT_DIALOG_DATA) public data: any,
              private folioService : FolioService,
              private fb : FormBuilder) { }

  ngOnInit(): void {
    this.dialModalRef.updatePosition({ top: '260px', left: '320px' });
  }
  FiltroFolioPersonalizado(){
    let idLibro = this.data.libro.id;

    console.log(this.emisor);
    this.folioService.FiltroFolioPersonalizado( idLibro,
                                                this.criteriosBusqueda.emisor.toLocaleUpperCase(),
                                                this.criteriosBusqueda.receptor.toUpperCase(),
                                                this.criteriosBusqueda.asunto.toUpperCase()).subscribe(
      respuesta=>{
        this.dialModalRef.close(respuesta.body);
      }
    );
  }
}
