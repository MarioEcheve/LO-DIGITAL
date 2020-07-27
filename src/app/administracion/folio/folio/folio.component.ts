import { Component, OnInit, AfterViewInit } from "@angular/core";
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
import { MatDialog } from "@angular/material/dialog";
import { ModalCrearFolioComponent } from "../modal-crear-folio/modal-crear-folio.component";
import { element } from "protractor";
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
export class FolioComponent implements OnInit, AfterViewInit {
  public tableData1: TableData;
  contrato = new Contrato();
  libros: Libro[] = [];
  folios: Folio[] = [];
  foliosOrigen = [];
  foliosSinBorradores = [];
  listaFolios: Folio[] = [];
  idlibro: number;
  folioFormGroup: FormGroup;
  libroSeleccionado: Libro;
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

  typesOfActions= [
      {
        id :1,
        accion : 'Bandeja de Folio'
      },
      {
        id :2,
        accion : 'Folio Mandante'
      },
      {
        id :3,
        accion : 'Folio Contratista'
      },
      {
        id :4,
        accion : 'Sin respuesta'
      },
      {
        id :5,
        accion : 'Sin Leer'
      },
      {
        id :6,
        accion : 'Destacados'
      },
      {
        id :7,
        accion : 'Borradores'
      }
  ];

  constructor(
    private route: ActivatedRoute,
    private contratoService: ContratoService,
    private libroService: LibroService,
    private folioServie: FolioService,
    private router: Router,
    private fb: FormBuilder,
    private usuarioLibroService: UsuarioLibroService,
    private dialog: MatDialog,
    private datePipe: DatePipe,
  ) {
    
  }

  ngOnInit(): void {
    this.folioServie.navBarChange(1);
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
  ngAfterViewInit(folios?:any){
    setTimeout(() => {
      console.log('after view init');
      console.log(this.folios);
      this.foliosOrigen = this.folios;
      this.folios = this.folios.filter(folio=> 
          folio.idUsuarioFirma !== null);
      this.foliosSinBorradores = this.folios;
    },1000);
  }
  buscaFolios(libro, filtra?: boolean) {
    this.folios = [];
    let folios=[];
    this.libroSeleccionado = libro;
    let usuario = JSON.parse(localStorage.getItem("user"));
    this.idlibro = libro.id;
    let nombreEmisor = "";
    this.folioServie.buscarFolioPorLibro(libro.id).subscribe((respuesta) => {
      folios = respuesta.body;
      this.obtenerPerfilLibroUsuario(this.idlibro, usuario.id);
      respuesta.body.forEach(element=>{
        if(element.fechaRequerida!== undefined){
          element.fechaRequerida = element.fechaRequerida.local();
          console.log(element.fechaRequerida.local());
          let resultado = calcDate(element.fechaRequerida.toDate(),new Date());
          console.log(resultado);
          if(element.estadoRespuesta !== null){
            if(element.estadoRespuesta.nombre.toLowerCase() === "respondido"){
              element.color = "#70F81D";
            }else{
              if(resultado[0] <= 1){
                element.color = "#F8F81D";
              }
              if(resultado[0] >= 2){
                element.color = "#3364FF";
              }
              if(resultado[0] <= -1){
                element.color = "#FF3C33";
              }
            }
          }else{
            if(resultado[0] <= 1){
              element.color = "#F8F81D";
            }
            if(resultado[0] >= 2){
              element.color = "#3364FF";
            }
            if(resultado[0] <= -1){
              element.color = "#FF3C33";
            }
          }
          
        }
        //this.folios = respuesta.body;
        
      })
      folios.forEach((element) => {
        this.usuarioLibroService
          .find(element.idUsuarioFirma)
          .subscribe((respuesta2) => {
            nombreEmisor = respuesta2.body.usuarioDependencia.usuario.firstName + " "+ respuesta2.body.usuarioDependencia.usuario.lastName;
            element.emisor = nombreEmisor;
            console.log(element.emisor);
          });
      });
    });
    setTimeout(() => {
      this.folios = folios;
      this.foliosOrigen = folios;
      this.folios = this.folios.filter(folio=> 
          folio.idUsuarioFirma !== null);
      this.foliosSinBorradores = this.folios;
    }, 1000);

  }
  nuevoFolio() {
    const dialogRef = this.dialog.open(ModalCrearFolioComponent, {
      width: "40%",
      height: "50%%",
      data: {
        libros: this.libros,
        libroSeleccionado: this.libroSeleccionado,
        habilitar : false,
        folio : null
      },
    });
    /*
    let usuario = JSON.parse(localStorage.getItem("user"));
    this.obtenerPerfilLibroUsuario(this.idlibro, usuario.id);
    this.router.navigate(["/folio/folio-borrador/", this.idlibro, usuario.id]);
    */
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

  filtrarFolios(accion : any){
   this.folios = this.foliosOrigen;
   switch(accion.id){
     case 1 : 
          this.folios = this.foliosSinBorradores;
      break;
    case 2 :
      this.folios =[];
      break;
    case 3 : 
      this.folios =[];
      break;
    case 4 : 
      this.folios = this.folios.filter(folio=>folio.estadoRespuesta?.nombre==='Pendiente')
      break;
    case 5 :
      this.folios = this.folios.filter(folio=>folio.idUsuarioLectura === null && folio.idUsuarioFirma !== null);
      break;
    case 6 : 
      this.folios =[];
      break;
    case 7 :
      this.folios = this.folios.filter(folio=>folio.idUsuarioFirma === null );
      break;
   }
  }
}

function calcDate(date1,date2) {
  var diff = Math.floor(date1.getTime() - date2.getTime());
  var day = 1000 * 60 * 60 * 24;

  var days = Math.floor(diff/day);
  var months = Math.floor(days/31);
  var years = Math.floor(months/12);

  var message = date2.toDateString();
  message += " was "
  message += days + " dias " 
  message += months + " meses "
  message += years + " año \n"
  return [days,months,years]
  }

  