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

  
  selectedValue: string;
    currentCity: string[];

  selectTheme = 'primary';
  cities = [
    {value: 'paris-0', viewValue: 'Advertencia'},
    {value: 'miami-1', viewValue: 'Informar'},
    {value: 'bucharest-2', viewValue: 'Adjuntar'},
    {value: 'new-york-3', viewValue: 'Termino'},
    {value: 'london-4', viewValue: 'Observacion'},
    {value: 'barcelona-5', viewValue: 'Otro Folio'},    
  ];

  criterio_fechas = [
    {value: 'fecha_rango', viewValue: 'Rago de fechas'},
    {value: '1_semana', viewValue: '1 semana'},
    {value: '2_semanas', viewValue: '2 semanas'},
    {value: '3_semanas', viewValue: '3 semanas'},
    {value: '1_mes', viewValue: '1 mes'},
    {value: '2_mes', viewValue: '2 mes'},
    {value: '6_meses', viewValue: '6 meses'},
    {value: '1_a', viewValue: '1 año'},    
  ];

  estado_respuesta = [
    {value: 'vigente', viewValue: 'Sin respuesta vigente'},
    {value: 'por_vencer', viewValue: 'Sin respuesta por vencer'},
    {value: 'vencidos', viewValue: 'Sin respuesta vencidos'},
    {value: 'respondidos', viewValue: 'Respondidos'},       
  ];







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
