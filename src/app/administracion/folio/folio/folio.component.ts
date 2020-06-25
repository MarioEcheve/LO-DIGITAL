import { Component, OnInit } from "@angular/core";
import { DropzoneConfigInterface } from "ngx-dropzone-wrapper";
import { TableData } from "src/app/md/md-table/md-table.component";

const defaultConfig: DropzoneConfigInterface = {
  clickable: true,
  addRemoveLinks: true,
};
@Component({
  selector: "app-folio",
  templateUrl: "./folio.component.html",
  styleUrls: ["./folio.component.css"],
})
export class FolioComponent implements OnInit {

  public tableData1: TableData;
  singleConfig: DropzoneConfigInterface = {
    ...defaultConfig,
    ...{
      maxFiles: 1,
    },
  };

  multipleConfig: DropzoneConfigInterface = {
    ...defaultConfig,
    ...{
      maxFiles: 10,
    },
  };

  cities = [
    { value: "paris-0", viewValue: "Libro Maestro | Cod.: LM01 | Clase Libro: Maestro | Tipo Firma: Digital Avanzada | Estado: Abierto"},
    { value: "miami-1", viewValue: "Libro Comunicaciones | Cod.: LA01 | Clase Libro: Auxiliar | Tipo Firma: Por Sistema | Estado: Abierto"},
    { value: "bucharest-2", viewValue: "Libro Prevención de Riesgos | Cod.: LA02 | Clase Libro: Auxiliar | Tipo Firma: Por Sistema | Estado: Abierto"},   
  ];
  constructor() {}

  ngOnInit(): void {
    this.tableData1 = {
      headerRow: ["# Folio", "Emisor", "Tipo Folio - Asunto", "Solicita Respuesta", "Fecha", "Acción"],
      dataRows: [
        [
          "0001",          
          "Fernando Vilches Soleman",          
          "Apertura Libro",
          "Aqui va el asunto del folio",          
          "",
          "",
          "12/02/2020",
          "btn-link",
        ],
        [
          "0002",          
          "Andres Contreras Bustamantes",
          "Solicitud", 
          "Aqui va el asunto del folio",              
          "",
          "",
          "12/02/2020",
          "btn-link",
        ],
        [
          "0003",          
          "Fernando Vilches Soleman",
          "Adjuntar Información", 
          "Aqui va el asunto del folio",                    
          "badge-warning",
          "14/07/2020",
          "12/02/2020",
          "btn-link",
        ],
        [
          "0004",          
          "Fernando Vilches Soleman",
          "Advertencia", 
          "Aqui va el asunto del folio",                   
          "",
          "",
          "12/02/2020",
          "btn-link",
        ],
        [
          "0005",          
          "Andres Contreras Bustamantes",
          "Adjuntar Información",
          "Aqui va el asunto del folio",                    
          "badge-danger",
          "12/02/2020",
          "12/02/2020",
          "btn-link",
        ],
      ],
    };
  }

  onUploadInit(args: any): void {
    // onUploadInit
  }

  onUploadError(args: any): void {
    // onUploadError
  }

  onUploadSuccess(args: any): void {
    // onUploadSuccess
  }
}
