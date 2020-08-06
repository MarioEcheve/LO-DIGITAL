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
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { UsuarioLibroService } from "../../services/usuario-libro.service";
import { UsuarioLibro } from "../../TO/usuario-libro.model";
import { MatDialog } from "@angular/material/dialog";
import { ModalCrearFolioComponent } from "../modal-crear-folio/modal-crear-folio.component";
import { element } from "protractor";
import * as moment from "moment";
import { GesFavoritoService } from "../../services/ges-favorito.service";
import { GesFavorito } from "../../TO/ges-favorito.model";
import { FiltroFolioPersonalizadoComponent } from "../../shared/filtro-folio-personalizado/filtro-folio-personalizado.component";
import { type } from "jquery";
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
  filtroFolios = [
    {
      id : 0,
      name : 'Numero Folio'
    },
    {
      id : 1,
      name : 'Emisor'
    },
    {
      id : 2,
      name : 'Receptor'
    }
  ]
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
  // definicion del form de los filtros
  formFiltrosGroup : FormGroup;
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
    private favoritoService : GesFavoritoService
  ) {
    
  }

  ngOnInit(): void {
    this.inicializarFormFiltros();
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
      this.foliosOrigen = this.folios;
      this.folios = this.folios.filter(folio=> 
          folio.idUsuarioFirma !== null);
      this.foliosSinBorradores = this.folios;
    },1500);
  }
  buscaFolios(libro, filtra?: boolean) {
    this.folios = [];
    let folios=[];
    this.libroSeleccionado = libro;
    let usuario = JSON.parse(localStorage.getItem("user"));
    this.idlibro = libro.id;
    let nombreEmisor = "";
    let nombreReceptor = "";
    this.folioServie.buscarFolioPorLibro(libro.id).subscribe((respuesta) => {
      folios = respuesta.body;
      this.obtenerPerfilLibroUsuario(this.idlibro, usuario.id);
      respuesta.body.forEach(element=>{
        if(element.fechaRequerida!== undefined){
          element.fechaRequerida = element.fechaRequerida.local();
          let resultado = calcDate(element.fechaRequerida.toDate(),new Date());
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
        
      });
      folios.forEach((element) => {
        if(element.idUsuarioFirma === null){
          this.usuarioLibroService
          .find(element.idUsuarioCreador)
          .subscribe((respuesta2) => {
            nombreEmisor = respuesta2.body.usuarioDependencia.usuario.firstName + " "+ respuesta2.body.usuarioDependencia.usuario.lastName;
            element.emisor = nombreEmisor;
          });
          if(element.idReceptor !== null ){
            this.usuarioLibroService
              .find(element.idReceptor )
              .subscribe((respuesta2) => {
                nombreReceptor = respuesta2.body.usuarioDependencia.usuario.firstName + " "+ respuesta2.body.usuarioDependencia.usuario.lastName;
                element.receptor = nombreReceptor;
              });
          }
        }else{
          this.usuarioLibroService
          .find(element.idUsuarioFirma )
          .subscribe((respuesta2) => {
            nombreEmisor = respuesta2.body.usuarioDependencia.usuario.firstName + " "+ respuesta2.body.usuarioDependencia.usuario.lastName;
            element.emisor = nombreEmisor;
          });
          this.usuarioLibroService
          .find(element.idReceptor )
          .subscribe((respuesta2) => {
            nombreReceptor = respuesta2.body.usuarioDependencia.usuario.firstName + " "+ respuesta2.body.usuarioDependencia.usuario.lastName;
            element.receptor = nombreReceptor;
          });
        }
        
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
        folio : null,

      },
    });
    /*
    let usuario = JSON.parse(localStorage.getItem("user"));
    this.obtenerPerfilLibroUsuario(this.idlibro, usuario.id);
    this.router.navigate(["/folio/folio-borrador/", this.idlibro, usuario.id]);
    */
  }
  eliminarFolio(row) {
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
      this.folios = this.folios.filter(folio=>folio.entidadCreacion === true && folio.idUsuarioFirma !== null);  
      break;
    case 3 : 
    this.folios = this.folios.filter(folio=>folio.entidadCreacion === false && folio.idUsuarioFirma !== null);  
      break;
    case 4 : 
      this.folios = this.folios.filter(folio=>folio.estadoRespuesta?.nombre==='Pendiente')
      break;
    case 5 :
      this.folios = this.folios.filter(folio=>folio.idUsuarioLectura === null && folio.idUsuarioFirma !== null);
      break;
    case 6 :
      this.folios = [];
      let nombreEmisor = "";
      let foliosGuardados= [];
      this.favoritoService.BuscarFavoritoByUsuario(this.usuarioLibro.id).subscribe(
        folioFavoritos =>{
          console.log(folioFavoritos.body);
          if(folioFavoritos.body.length > 0){
            folioFavoritos.body.forEach(
              element=>{
                this.usuarioLibroService
                .find(element.folio.idUsuarioCreador)
                .subscribe((respuesta2) => {
                  nombreEmisor = respuesta2.body.usuarioDependencia.usuario.firstName + " "+ respuesta2.body.usuarioDependencia.usuario.lastName;
                  element.folio.emisor = nombreEmisor;
                  foliosGuardados = [...foliosGuardados, element.folio];
                });
              }
            );
          }
          setTimeout(() => {
            this.folios = foliosGuardados;
            console.log(foliosGuardados);
          }, 500);
          
        }
      );
      break;
    case 7 :
      this.folios = this.folios.filter(folio=>folio.idUsuarioFirma === null );
      break;
   }
  }
  favorito(row){
    let existe = false;
    let idFolioExiste= null;
    let folioFavorito = new GesFavorito();
    folioFavorito.usuarioLibro = this.usuarioLibro;
    folioFavorito.folio = row;
    folioFavorito.fechaCreacion = moment(Date.now());
    folioFavorito.nota = "";
    this.favoritoService.BuscarFavoritoByFolio(row.id).subscribe(
      folioFavorito => {
        console.log(folioFavorito);
        if(folioFavorito.body.length > 0 ){
          existe = true;
          idFolioExiste = folioFavorito.body[0].id;
        }else{
          existe = false;
        }
      }
    );
    setTimeout(() => {
      if(existe === false){
        this.favoritoService.create(folioFavorito).subscribe(
          folioFavorito =>{
    
          });
      }else{
        this.favoritoService.delete(idFolioExiste).subscribe();
      }
    }, 300);
  }
  modalFiltroFolioPersonalizado(){
   
    const dialogRef = this.dialog.open(FiltroFolioPersonalizadoComponent, {
      width: "70%",
      height: "50%%",
      data: { libro : this.libroSeleccionado},
      backdropClass: 'cdk-overlay-transparent-backdrop',
    });
    dialogRef.afterClosed().subscribe((result) => {
      //this.folios = this.foliosOrigen;
      console.log(result);
      let foliosBuscados = [];
      if(result !== undefined){
        result.forEach(element => {
          console.log(element);
          foliosBuscados = [...foliosBuscados,this.foliosOrigen.filter(folio => folio.id === element.id)[0]];
        });
        setTimeout(() => {
          console.log(foliosBuscados);
          this.folios = foliosBuscados;
        }, 500);
      }else{
        setTimeout(() => {
          //this.folios = this.foliosOrigen;
        }, 500);
        
      }
    });
  }
  filtraFolios(){

    let valorBusqueda = this.formFiltrosGroup.controls['inputBusqueda'].value;
    let criterioBusqueda = this.formFiltrosGroup.controls['criterioBusqueda'].value;
    console.log(this.formFiltrosGroup.value);
    if(criterioBusqueda === 0){
      this.folios = this.foliosOrigen.filter(
        folio => {
          if(folio.numeroFolio !== null){
            return folio.numeroFolio.toString() === valorBusqueda
          }else{
          }
        }
      );
    console.log(this.folios);
    }
    if(criterioBusqueda === 1){
      this.filter(valorBusqueda, criterioBusqueda);
    }
    if(criterioBusqueda === 2){
      this.filter(valorBusqueda, criterioBusqueda);
    }
  }
  inicializarFormFiltros(){
    this.formFiltrosGroup = this.fb.group({
      inputBusqueda : ['', Validators.required],
      criterioBusqueda : ['', Validators.required]
    });
  }
  filter(typ:  string, criterio : any) {
    let valorBusqueda = "";
    valorBusqueda = typ;
    valorBusqueda = valorBusqueda.toLowerCase();
    let foliosFiltrados = [];
    if(criterio === 1){
      foliosFiltrados = this.foliosOrigen.filter(folio=> folio.emisor.toLowerCase().indexOf(valorBusqueda) > -1);
      this.folios = foliosFiltrados;
      console.log(foliosFiltrados);
    }
    if(criterio === 2){
      console.log(this.foliosOrigen);
      foliosFiltrados = this.foliosOrigen.filter(folio=> {
        if(folio.receptor !== undefined){
          return folio.receptor.toLowerCase().indexOf(valorBusqueda) > -1
        }
      });
      this.folios = foliosFiltrados;
      console.log(foliosFiltrados);
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

  