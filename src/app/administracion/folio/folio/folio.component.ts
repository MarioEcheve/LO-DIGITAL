import { Component, OnInit } from "@angular/core";
import { DropzoneConfigInterface } from "ngx-dropzone-wrapper";
import { TableData } from "src/app/md/md-table/md-table.component";
import { ActivatedRoute, Router } from "@angular/router";
import { ContratoService } from "../../services/contrato.service";
import { IContrato, Contrato } from "../../TO/contrato.model";
import { Libro } from "../../TO/libro.model";
import { LibroService } from "../../services/libro.service";
import { Folio } from "../../TO/folio.model";
import { FolioService } from "../../services/folio.service";
import { DatePipe } from "@angular/common";
import * as moment from "moment";

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
  contrato = new Contrato();
  libros: Libro[] = [];
  folios: Folio[] = [];
  idlibro: number;
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
    {
      value: "paris-0",
      viewValue:
        "Libro Maestro | Cod.: LM01 | Clase Libro: Maestro | Tipo Firma: Digital Avanzada | Estado: Abierto",
    },
    {
      value: "miami-1",
      viewValue:
        "Libro Comunicaciones | Cod.: LA01 | Clase Libro: Auxiliar | Tipo Firma: Por Sistema | Estado: Abierto",
    },
    {
      value: "bucharest-2",
      viewValue:
        "Libro Prevención de Riesgos | Cod.: LA02 | Clase Libro: Auxiliar | Tipo Firma: Por Sistema | Estado: Abierto",
    },
  ];
  constructor(
    private route: ActivatedRoute,
    private contratoService: ContratoService,
    private libroService: LibroService,
    private folioServie: FolioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    let id = parseInt(this.route.snapshot.paramMap.get("id"));
    this.contratoService.find(id).subscribe((respuesta) => {
      this.contrato = respuesta.body;
      this.libroService
        .buscarlibroPorContrato(respuesta.body.id)
        .subscribe((respuesta) => {
          this.libros = respuesta.body;
        });
    });
    this.tableData1 = {
      headerRow: [
        "# Folio",
        "Emisor",
        "Tipo Folio - Asunto",
        "Solicita Respuesta",
        "Fecha",
        "Acción",
      ],
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
  buscaFolios(libro) {
    this.idlibro = libro.id;
    this.folioServie.buscarFolioPorLibro(libro.id).subscribe((respuesta) => {
      console.log(respuesta.body);
      this.folios = respuesta.body;
      this.folios.forEach((element) => {});
    });
  }
  nuevoFolio() {
    this.router.navigate(["/folio/folio-borrador/", this.idlibro]);
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
