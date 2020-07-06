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
import Swal from "sweetalert2/dist/sweetalert2.js";
import { FormGroup, FormBuilder } from "@angular/forms";
import { UsuarioLibroService } from "../../services/usuario-libro.service";
import { UsuarioLibro } from "../../TO/usuario-libro.model";

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
  listaFolios: Folio[] = [];
  idlibro: number;
  folioFormGroup: FormGroup;
  usuarioLibro = new UsuarioLibro();
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
    private router: Router,
    private fb: FormBuilder,
    private usuarioLibroService: UsuarioLibroService
  ) {}

  ngOnInit(): void {
    this.folioFormGroup = this.fb.group({
      libro: [],
    });

    let id = parseInt(this.route.snapshot.paramMap.get("id"));
    this.contratoService.find(id).subscribe((respuesta) => {
      this.contrato = respuesta.body;
      this.libroService
        .buscarlibroPorContrato(respuesta.body.id)
        .subscribe((respuesta) => {
          this.libros = respuesta.body;
        });
    });

    console.log(
      "idLibro" + parseInt(this.route.snapshot.paramMap.get("idLibro"))
    );

    this.libroService
      .find(parseInt(this.route.snapshot.paramMap.get("idLibro")))
      .subscribe((respuesta) => {
        this.buscaFolios(respuesta.body);
        let usuario = JSON.parse(localStorage.getItem("user"));
        this.obtenerPerfilLibroUsuario(respuesta.body.id, usuario.id);
        this.folioFormGroup.patchValue({
          libro: respuesta.body.nombre,
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
    let usuario = JSON.parse(localStorage.getItem("user"));
    this.idlibro = libro.id;
    this.folioServie.buscarFolioPorLibro(libro.id).subscribe((respuesta) => {
      for (var i = 0; i < respuesta.body.length; i++) {
        console.log(respuesta.body[i]);
        this.usuarioLibroService
          .find(respuesta.body[i].idUsuarioFirma)
          .subscribe((respuesta2) => {
            console.log(respuesta2);
          });
      }

      this.folios = respuesta.body;
      this.obtenerPerfilLibroUsuario(this.idlibro, usuario.id);
    });
  }
  nuevoFolio() {
    let usuario = JSON.parse(localStorage.getItem("user"));
    this.obtenerPerfilLibroUsuario(this.idlibro, usuario.id);
    this.router.navigate(["/folio/folio-borrador/", this.idlibro, usuario.id]);
  }
  eliminarFolio(row) {
    console.log(row);
    Swal.fire({
      title: "Esta Seguro ?",
      text: "Los cambios no podran ser revertidos!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Si, Eliminar folio!",
      cancelButtonText: "No, Mantener folio",
    }).then((result) => {
      if (result.value) {
        let libro = new Libro();
        libro.id = this.idlibro;
        this.folioServie.delete(row.id).subscribe((respuesta) => {
          //console.log(respuesta);
          this.buscaFolios(libro);
        });
        Swal.fire("Eliminado!", "Folio Eliminado Correctamente.", "success");
        // For more information about handling dismissals please visit
        // https://sweetalert2.github.io/#handling-dismissals
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        //Swal.fire("Cancelado", "Your imaginary file is safe :)", "error");
      }
    });
  }
  folioFirmado(row) {
    this.router.navigate(["/folio/folio-firmado/", row.id]);
  }
  detalleLibro(row) {
    this.router.navigate(["/folio/folio-detalle/", row.id]);
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

  obtenerPerfilLibroUsuario(idLibro, idUsuario) {
    this.usuarioLibroService
      .buscarlibroPorContrato(idLibro, idUsuario)
      .subscribe((respuesta) => {
        this.usuarioLibro = respuesta.body[0];
      });
  }
  volverContrato() {
    this.router.navigate(["/contrato/detalle-contrato/", this.contrato.id]);
  }
}
