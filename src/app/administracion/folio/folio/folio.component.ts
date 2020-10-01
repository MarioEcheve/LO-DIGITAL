import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";
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
import { NgxPermissionsService } from "ngx-permissions";
import { UsuarioDependenciaService } from "../../services/usuario-dependencia.service";
import { UsuarioDependencia } from "../../TO/usuario-dependencia.model";
import {animate, state, style, transition, trigger} from '@angular/animations';
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";

const defaultConfig: DropzoneConfigInterface = {
  clickable: true,
  addRemoveLinks: true,
};
@Component({
  selector: "app-folio",
  templateUrl: "./folio.component.html",
  styleUrls: ["./folio.component.css"],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class FolioComponent implements OnInit, AfterViewInit {
  public tableData1: TableData;
  // implementacion nueva tabla
  columnsToDisplay = ['Folio', 'Emisor', 'Tipo Folio - Asunto', 'Fecha requerida' ,'Fecha creacion', 'Acción' ];
  expandedElement: Folio | null;
  dataSource: MatTableDataSource<Folio>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  //-----------------------------
  
  marcaTipoFiltroSideBar = 0;
  indexEliminadoFavorito = [];
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
  type="number";
  muestraRedactarFolioAdminActivo = true;
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
    },
    {
      id : 3,
      name : 'Asunto'
    },
    {
      id : 4,
      name : 'Todos'
    }
  ]
  singleConfig: DropzoneConfigInterface = {
    ...defaultConfig,
    ...{
      maxFiles: 1,
    },
  };
  // contador de filtros sidebar folio
  contadorFolios = [
    {
      bandeja : 0
    },
    {
      folioMandante : 0
    },
    {
      folioContratista : 0
    },
    {
      sinRespuesta : 0
    },
    {
      sinLeer : 0
    },
    {
      destacados : 0
    },
    {
      borradores : 0
    },

  ]
  multipleConfig: DropzoneConfigInterface = {
    ...defaultConfig,
    ...{
      maxFiles: 10,
    },
  };
  typesOfActions= [
      {
        id :1,
        accion : 'Bandeja de Folio',
        icon :'inbox',
        isClicked: true,
        contadorFolios : this.contadorFolios[0].bandeja
      },
      {
        id :2,
        accion : 'Folio Mandante',
        icon :'apartment',
        isClicked: false,
        contadorFolios : this.contadorFolios[0].folioMandante
      },
      {
        id :3,
        accion : 'Folio Contratista',
        icon :'engineering',
        isClicked: false,
        contadorFolios : this.contadorFolios[0].folioContratista
      },
      {
        id :4,
        accion : 'Sin respuesta',
        icon :'unsubscribe',
        isClicked: false,
        contadorFolios : this.contadorFolios[0].sinRespuesta
      },
      {
        id :5,
        accion : 'Sin Leer',
        icon :'mark_email_unread',
        isClicked: false,
        contadorFolios : this.contadorFolios[0].sinLeer
      },
      {
        id :6,
        accion : 'Destacados',
        icon :'star',
        isClicked: false,
        contadorFolios : this.contadorFolios[0].destacados
      },
      {
        id :7,
        accion : 'Borradores',
        icon :'insert_drive_file',
        isClicked: false,
        contadorFolios : this.contadorFolios[0].borradores 
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
    private favoritoService : GesFavoritoService,
    private permissionsService : NgxPermissionsService,
    private UsuarioDependenciaService: UsuarioDependenciaService
  ) {
    
  }

  ngOnInit(): void {
    let id = parseInt(this.route.snapshot.paramMap.get("id"));
    let usuario = JSON.parse(localStorage.getItem("user"));
    this.UsuarioDependenciaService.findUserByUsuarioDependencia(usuario.id).subscribe(
      usuarioDependencia=>{
        if(usuarioDependencia.body[0]?.perfilUsuarioDependencia?.nombre.toLowerCase() === "super usuario"){
          this.contratoService.find(id).subscribe((respuesta) => {
            this.contrato = respuesta.body;
            this.libroService
              .buscarlibroPorContrato(respuesta.body.id)
              .subscribe((respuesta) => {
                this.libros = respuesta.body;
              });
          });
        }else{
          this.contratoService.find(id).subscribe((respuesta) => {
            this.contrato = respuesta.body;
            this.libroService.getMisLibros(usuario.id).subscribe(
              libros=>{
                this.libros = libros.body;
              }
            );
          });
          
        }
      }
    );
    let usuarioActual = JSON.parse(localStorage.getItem("user"));
    this.getPermisos(this.route.snapshot.paramMap.get("idLibro"),usuarioActual.id);
    this.inicializarFormFiltros();
    this.folioServie.navBarChange(1);
    this.folioFormGroup = this.fb.group({
      libro: [],
    });
  
    
    this.libroService
      .find(parseInt(this.route.snapshot.paramMap.get("idLibro")))
      .subscribe((respuesta) => {
        this.buscaFolios(respuesta.body);
        this.obtenerPerfilLibroUsuario(respuesta.body.id, usuario.id);
        this.folioFormGroup.patchValue({
          libro: respuesta.body.nombre,
        });
       
      });
    /*
    this.tableData1 = {
      headerRow: [
        "# Folio",
        "Emisor",
        "Tipo Folio - Asunto",
        "Solicita Respuesta",
        "Fecha",
        "Acción",
      ],
      dataRows: [],
    };
    */
  }
  async ngAfterViewInit(folios?:any){
    await new Promise((resolve,reject)=>{
      setTimeout(() => {
        //this.foliosOrigen = this.folios;
        this.folios = this.folios.filter(folio=> 
            folio.idUsuarioFirma !== null);
        this.foliosSinBorradores = this.folios;
        this.folioServie.favoritosUsuarioLibro(this.usuarioLibro.id, this.libroSeleccionado.id).subscribe(
          favoritos=>{
            console.log(favoritos.body);
            this.folios.forEach(element=>{
              let valor = null;
              valor = favoritos.body.find(favorito=> favorito.id === element.id);
              if(valor !== undefined){
                element.existeFavorito = false;
              }else{
                element.existeFavorito = true;
              }
            })
          }
        );
        resolve(this.folios);
      },100);
    }).then((folios: any)=>{
      this.getContadorFolioSideBar();
      console.log(folios);
      this.dataSource = new MatTableDataSource(folios);
      this.dataSource.paginator = this.paginator;
    })  
    
  }
  async buscaFolios(libro, filtra?: boolean) {
    this.folios = [];
    let folios=[];
    this.libroSeleccionado = libro;
    let usuario = JSON.parse(localStorage.getItem("user"));
    this.idlibro = libro.id;
    let nombreReceptor = "";
    await new Promise((resolve,reject)=>{
      setTimeout(() => {
        this.folioServie.buscarFolioPorLibro(libro.id).subscribe((respuesta) => {
          folios = respuesta.body;
          this.obtenerPerfilLibroUsuario(this.idlibro, usuario.id);
          respuesta.body.forEach(element=>{
            if(element.fechaRequerida!== undefined){
              element.fechaRequerida = element.fechaRequerida.local();
              let resultado = calcDate(element.fechaRequerida.toDate(),new Date());
              if(element.estadoRespuesta !== null){
                if(element.estadoRespuesta.nombre.toLowerCase() === "respondido"){
                  element.color = "#4EA21A";
                }else{
                  if(resultado[0] <= 1){
                    element.color = "#FFAE00";
                  }
                  if(resultado[0] >= 2){
                    element.color = "#4285F4";
                  }
                  if(resultado[0] <= -1){
                    element.color = "#FF3C33";
                  }
                }
              }else{
                if(resultado[0] <= 1){
                  element.color = "#FFAE00";
                }
                if(resultado[0] >= 2){
                  element.color = "#4285F4";
                }
                if(resultado[0] <= -1){
                  element.color = "#FF3C33";
                }
              }
            }
          });
          folios.forEach((element) => {
            if(element.idUsuarioFirma === null){
              /*
              this.usuarioLibroService
              .find(element.idUsuarioCreador)
              .subscribe((respuesta2) => {
                nombreEmisor = ;
                element.emisor = nombreEmisor;
              },error=>{
              });
              if(element.idReceptor !== null ){
                this.usuarioLibroService
                  .find(element.idReceptor )
                  .subscribe((respuesta2) => {
                    nombreReceptor = respuesta2.body.usuarioDependencia.usuario.firstName + " "+ respuesta2.body.usuarioDependencia.usuario.lastName;
                    element.receptor = nombreReceptor;
                  },error=>{
                  })
                  
              }*/
            }else{
              this.usuarioLibroService
              .find(element.idReceptor )
              .subscribe((respuesta2) => {
                nombreReceptor = respuesta2.body.usuarioDependencia.usuario.firstName + " "+ respuesta2.body.usuarioDependencia.usuario.lastName;
                element.receptor = nombreReceptor;
              },error=>{
              })
            }
          });
          resolve(folios);
        });
      }, 1000);
    }).then((folios:any)=>{
      this.folios = folios;
      this.folios.forEach(element=>{
        element.existeFavorito = true;
      })
      this.foliosOrigen = folios;
      this.folios = this.folios.filter(folio=> 
          folio.idUsuarioFirma !== null);
      this.ngAfterViewInit();
      this.foliosSinBorradores = this.folios;
      this.getContadorFolioSideBar();
      
    });
    
    
  }

  buscarFolioPorLibro(idLibro){

  }


  nuevoFolio() {
    
    const dialogRef = this.dialog.open(ModalCrearFolioComponent, {
      width: "480px",
      height: "290px",
      data: {
        libros: this.libros,
        libroSeleccionado: this.libroSeleccionado,
        habilitar : false,
        folio : null,
        editar : false,
        usuarioLibro : this.usuarioLibro

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
    this.router.navigate(["/folio/folio-firmado", row.id]);
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

  async obtenerPerfilLibroUsuario(idLibro, idUsuario) {
    this.usuarioLibroService
      .buscarlibroPorContrato(idLibro, idUsuario)
      .subscribe((respuesta) => {
        this.usuarioLibro = respuesta.body[0];
        if(this.usuarioLibro.adminActivo === false && this.usuarioLibro.perfilUsuarioLibro.nombre.toLowerCase() === "superior") {
          this.muestraRedactarFolioAdminActivo = true;
        }
        if(this.usuarioLibro.adminActivo === false && this.usuarioLibro.perfilUsuarioLibro.nombre.toLowerCase() === "asistente") {
          this.muestraRedactarFolioAdminActivo = true;
        }
        if(this.usuarioLibro.adminActivo === false && this.usuarioLibro.perfilUsuarioLibro.nombre.toLowerCase() === "visita") {
          this.muestraRedactarFolioAdminActivo = false;
        }
        if(this.usuarioLibro.adminActivo === false && this.usuarioLibro.perfilUsuarioLibro.nombre.toLowerCase() === "administrador") {
          this.muestraRedactarFolioAdminActivo = false;
        }
        if(this.usuarioLibro.adminActivo === true && this.usuarioLibro.perfilUsuarioLibro.nombre.toLowerCase() === "administrador") {
          this.muestraRedactarFolioAdminActivo = true;
        }
        if(this.usuarioLibro.adminActivo === false && this.usuarioLibro.perfilUsuarioLibro.nombre.toLowerCase() === "administrador/s") {
          this.muestraRedactarFolioAdminActivo = false;
        }
        if(this.usuarioLibro.adminActivo === true && this.usuarioLibro.perfilUsuarioLibro.nombre.toLowerCase() === "administrador/s") {
          this.muestraRedactarFolioAdminActivo = true;
        }
      });
      
  }
  volverContrato() {
    this.router.navigate(["/libro/detalle-libro/", this.libroSeleccionado.id]);
  }

  filtrarFolios(accion : any){
   this.folios = [];
   this.folios = this.foliosOrigen;
   let index = this.typesOfActions.indexOf(accion);
   this.typesOfActions.forEach(acciones=>{
     acciones.isClicked = false;
   })
   switch(accion.id){
     case 1 : 
        this.folios = this.foliosSinBorradores;
        // permite actualizar el folio si se elimino desde el favorito
        if(this.indexEliminadoFavorito.length > 0 ){
          this.indexEliminadoFavorito.forEach(element=>{
            let folio = this.folios.find(folio => folio.id === element.id);
            let index = this.folios.indexOf(folio);
            this.folios[index].existeFavorito = true;
            console.log(this.folios[index]);
          })
        }
        this.typesOfActions[index].isClicked = true;
        this.dataSource = new MatTableDataSource(this.folios);
        this.dataSource.paginator = this.paginator;
        this.marcaTipoFiltroSideBar === 1;
        this.indexEliminadoFavorito = [];
       
      break;
    case 2 :
      this.folios = this.folios.filter(folio=>folio.entidadCreacion === true && folio.idUsuarioFirma !== null); 
      if(this.indexEliminadoFavorito.length > 0 ){
        this.indexEliminadoFavorito.forEach(element=>{
          let folio = this.folios.find(folio => folio.id === element.id);
          let index = this.folios.indexOf(folio);
          this.folios[index].existeFavorito = true;
          console.log(this.folios[index]);
        })
      }
      this.typesOfActions[index].isClicked = true;
      this.dataSource = new MatTableDataSource(this.folios);
      this.dataSource.paginator = this.paginator;
      this.marcaTipoFiltroSideBar === 2;
      this.indexEliminadoFavorito = [];
      break;
    case 3 : 
      this.folios = this.folios.filter(folio=>folio.entidadCreacion === false && folio.idUsuarioFirma !== null);  
      if(this.indexEliminadoFavorito.length > 0 ){
        this.indexEliminadoFavorito.forEach(element=>{
          let folio = this.folios.find(folio => folio.id === element.id);
          let index = this.folios.indexOf(folio);
          this.folios[index].existeFavorito = true;
          console.log(this.folios[index]);
        })
      }
      this.typesOfActions[index].isClicked = true;
      this.dataSource = new MatTableDataSource(this.folios);
      this.dataSource.paginator = this.paginator;
      this.marcaTipoFiltroSideBar === 3;
      this.indexEliminadoFavorito = [];
      break;
    case 4 : 
      this.folios = this.folios.filter(folio=>folio.estadoRespuesta?.nombre==='Pendiente')
      if(this.indexEliminadoFavorito.length > 0 ){
        this.indexEliminadoFavorito.forEach(element=>{
          let folio = this.folios.find(folio => folio.id === element.id);
          let index = this.folios.indexOf(folio);
          this.folios[index].existeFavorito = true;
          console.log(this.folios[index]);
        })
      }
      this.typesOfActions[index].isClicked = true;
      this.dataSource = new MatTableDataSource(this.folios);
      this.dataSource.paginator = this.paginator;
      this.marcaTipoFiltroSideBar === 4;
      this.indexEliminadoFavorito = [];
      break;
    case 5 :
      this.folios = this.folios.filter(folio=>folio.idUsuarioLectura === null && folio.idUsuarioFirma !== null);
      if(this.indexEliminadoFavorito.length > 0 ){
        this.indexEliminadoFavorito.forEach(element=>{
          let folio = this.folios.find(folio => folio.id === element.id);
          let index = this.folios.indexOf(folio);
          this.folios[index].existeFavorito = true;
          console.log(this.folios[index]);
        })
      }
      this.typesOfActions[index].isClicked = true;
      this.dataSource = new MatTableDataSource(this.folios);
      this.dataSource.paginator = this.paginator;
      this.marcaTipoFiltroSideBar === 5;
      this.indexEliminadoFavorito = [];
      break;
    case 6 :
      this.folios = [];
      let nombreEmisor = "";
      let foliosGuardados= [];
      this.favoritoService.BuscarFavoritoByUsuario(this.usuarioLibro.id).subscribe(
        folioFavoritos =>{
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
            if(this.indexEliminadoFavorito.length > 0 ){
              this.indexEliminadoFavorito.forEach(element=>{
                let folio = this.folios.find(folio => folio.id === element.id);
                let index = this.folios.indexOf(folio);
                this.folios[index].existeFavorito = true;
                console.log(this.folios[index]);
              })
            }
            this.dataSource = new MatTableDataSource(this.folios);
            this.dataSource.paginator = this.paginator;
          }, 600);
        }
      );
      this.typesOfActions[index].isClicked = true;
      this.marcaTipoFiltroSideBar = 6;
      break;
    case 7 :
      console.log(this.usuarioLibro);
      this.folios = this.folios.filter(folio=>folio.idUsuarioFirma === null );
      this.typesOfActions[index].isClicked = true;
      if(this.usuarioLibro.perfilUsuarioLibro.nombre.toLowerCase() === "visita"){
        this.folios = [];
      }
      if(this.usuarioLibro.perfilUsuarioLibro.nombre.toLowerCase() === "administrador" && this.usuarioLibro.adminActivo === false){
        this.folios = [];
      }
      if(this.usuarioLibro.perfilUsuarioLibro.nombre.toLowerCase() === "superior"){
        this.folios = this.folios.filter(folio=>folio.tipoFolio.nombre.toLowerCase() === "cambio administrador" );
      }
      if(this.usuarioLibro.perfilUsuarioLibro.nombre.toLowerCase() === "asistente"){
        this.folios = this.folios.filter(folio=>folio.tipoFolio.nombre.toLowerCase() !== "cambio administrador" );
      }
      if(this.indexEliminadoFavorito.length > 0 ){
        this.indexEliminadoFavorito.forEach(element=>{
          let folio = this.folios.find(folio => folio.id === element.id);
          let index = this.folios.indexOf(folio);
          this.folios[index].existeFavorito = true;
          console.log(this.folios[index]);
        })
      }
      setTimeout(() => {
        this.indexEliminadoFavorito = [];
        this.dataSource = new MatTableDataSource(this.folios);
        this.dataSource.paginator = this.paginator;
        this.marcaTipoFiltroSideBar === 7;
      }, 300);
      
      break;
   }
  }
  async favorito(row){
    let existe = false;
    let idFolioExiste= null;
    let folioFavorito = new GesFavorito();
    folioFavorito.usuarioLibro = this.usuarioLibro;
    folioFavorito.folio = row;
    folioFavorito.fechaCreacion = moment(Date.now());
    folioFavorito.nota = "";
    existe = await this.getFavoritos(row.id);
    if(existe === false){
      this.favoritoService.create(folioFavorito).subscribe(
        folioFavorito =>{
          let index = this.folios.indexOf(row);
          this.folios[index].existeFavorito = false;
          this.dataSource = new MatTableDataSource(this.folios);
          this.dataSource.paginator = this.paginator;
          this.getContadorFolioSideBar();
          Swal.fire("Agregado!", "Favorito Agregado Correctamente.", "success");
        });
    }
  }
  async getFavoritos(idFolio){
    let existe = false;
    let idFolioExiste= null;
    await new Promise((resolve,reject)=>{
      this.favoritoService.BuscarFavoritoByFolio(idFolio).subscribe(
        folioFavorito => {
          if(folioFavorito.body.length > 0 ){
            existe = true;
            idFolioExiste = folioFavorito.body[0].id;
          }else{
            existe = false;
          }
          return resolve(existe);
        }
      );
    });
    return existe;
  }
  modalFiltroFolioPersonalizado(){
   
    const dialogRef = this.dialog.open(FiltroFolioPersonalizadoComponent, {
      width: "650px",
      height: "490px",
      data: { libro : this.libroSeleccionado},
      backdropClass: 'cdk-overlay-transparent-backdrop',
    });
    dialogRef.afterClosed().subscribe((result) => {
      //this.folios = this.foliosOrigen;
      let foliosBuscados = [];
      if(result !== undefined){
        result.forEach(element => {
          foliosBuscados = [...foliosBuscados,this.foliosOrigen.filter(folio => folio.id === element.id)[0]];
        });
        setTimeout(() => {
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
    if(criterioBusqueda === 0){
      this.folios = this.foliosOrigen.filter(
        folio => {
          if(folio.numeroFolio !== null){
            return folio.numeroFolio.toString() === valorBusqueda
          }else{
          }
        }
      );
      this.dataSource = new MatTableDataSource(this.folios);
        this.dataSource.paginator = this.paginator;
    }
    if(criterioBusqueda === 1){
      this.filter(valorBusqueda, criterioBusqueda);
    }
    if(criterioBusqueda === 2){

      this.filter(valorBusqueda, criterioBusqueda);
    }
    if(criterioBusqueda === 3){
      this.filter(valorBusqueda, criterioBusqueda);
    }
    if(criterioBusqueda === 4){
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
      this.dataSource = new MatTableDataSource(this.folios);
      this.dataSource.paginator = this.paginator;
    }
    if(criterio === 2){
      foliosFiltrados = this.foliosOrigen.filter(folio=> {
        if(folio.receptor !== undefined){
          return folio.receptor.toLowerCase().indexOf(valorBusqueda) > -1
        }
      });
      this.folios = foliosFiltrados;
      this.dataSource = new MatTableDataSource(this.folios);
      this.dataSource.paginator = this.paginator;
    }
    if(criterio === 3){
      foliosFiltrados = this.foliosOrigen.filter(folio=> {
          return folio.asunto.toLowerCase().indexOf(valorBusqueda) > -1
      });
      this.folios = foliosFiltrados;
      this.dataSource = new MatTableDataSource(this.folios);
      this.dataSource.paginator = this.paginator;
    }
    if(criterio === 4){
      //this.formFiltrosGroup.controls['inputBusqueda'].setValue('');
      this.folios = this.foliosOrigen;
      this.dataSource = new MatTableDataSource(this.folios);
      this.dataSource.paginator = this.paginator;
    }
  }
  setForm(filtros:any){
    let criterioBusqueda = filtros.id;
    if(criterioBusqueda === 0){
      this.formFiltrosGroup.controls['inputBusqueda'].setValidators([Validators.required]);
      this.formFiltrosGroup.updateValueAndValidity();
      this.type="number";
    }
    if(criterioBusqueda === 1 || criterioBusqueda === 2 || criterioBusqueda === 3){
      this.formFiltrosGroup.controls['inputBusqueda'].setValidators([Validators.required,Validators.minLength(3)]);
      this.formFiltrosGroup.updateValueAndValidity();
      this.type="text";
    }
    if(criterioBusqueda === 4){
      this.formFiltrosGroup.controls['inputBusqueda'].setValue('');
      this.formFiltrosGroup.controls['inputBusqueda'].setValidators([Validators.maxLength(40)]);
      this.formFiltrosGroup.updateValueAndValidity();
      this.type="text";
    }
    console.log(this.formFiltrosGroup.get('inputBusqueda'));
  }
  getPermisos(idLibro?:any,idUsuario?:any){
    let usuario = JSON.parse(localStorage.getItem("user"));
    let perfilUsuario = new UsuarioDependencia();
    this.UsuarioDependenciaService.findUserByUsuarioDependencia(usuario.id).subscribe(
      usuarioDependencia=>{
        perfilUsuario = usuarioDependencia.body[0].perfilUsuarioDependencia;
        let permisos = [perfilUsuario.nombre.toLowerCase()]
        
      });
    this.usuarioLibroService
      .buscarlibroPorContrato(idLibro, idUsuario)
      .subscribe((respuesta) => {
        let permisos = [respuesta.body[0].perfilUsuarioLibro.nombre.toLowerCase()];
        this.permissionsService.loadPermissions(permisos);
      });
  }

  setActive(button: any): void {
    for(let but of this.typesOfActions) {
      but.isClicked = false;
    }

    button.isClicked = true;
  }
  getContadorFolioSideBar(){
    let foliosFalso = this.foliosSinBorradores;
    let contadorBandeja =  foliosFalso.length;
    foliosFalso = this.foliosOrigen;
    let contadorFolioMandante =  foliosFalso.filter(folio=>folio.entidadCreacion === true && folio.idUsuarioFirma !== null); 
    foliosFalso = this.foliosOrigen;
    let contadorFolioContratista = foliosFalso.filter(folio=>folio.entidadCreacion === false && folio.idUsuarioFirma !== null);  
    foliosFalso = this.foliosOrigen;
    let contadorSinRespuesta = foliosFalso.filter(folio=>folio.estadoRespuesta?.nombre==='Pendiente');
    foliosFalso = this.foliosOrigen;
    let contadorSinLeer = foliosFalso.filter(folio=>folio.idUsuarioLectura === null && folio.idUsuarioFirma !== null);
    foliosFalso = this.foliosOrigen;
    let contadorBorradores = [];
    foliosFalso = foliosFalso.filter(folio=>folio.idUsuarioFirma === null );
    contadorBorradores = foliosFalso;
    if(this.usuarioLibro.perfilUsuarioLibro?.nombre.toLowerCase() === "visita"){
      foliosFalso = [];
      contadorBorradores = foliosFalso;
    }
    if(this.usuarioLibro.perfilUsuarioLibro.nombre.toLowerCase() === "administrador" && this.usuarioLibro.adminActivo === false){
      foliosFalso = [];
      contadorBorradores = foliosFalso;
    }
    if(this.usuarioLibro.perfilUsuarioLibro.nombre.toLowerCase() === "superior"){
      foliosFalso = foliosFalso.filter(folio=>folio.tipoFolio.nombre.toLowerCase() === "cambio administrador" );
      contadorBorradores = foliosFalso;
    }
    if(this.usuarioLibro.perfilUsuarioLibro.nombre.toLowerCase() === "asistente"){
      foliosFalso = foliosFalso.filter(folio=>folio.tipoFolio.nombre.toLowerCase() !== "cambio administrador" );
      contadorBorradores = foliosFalso;
    }
    foliosFalso = this.foliosOrigen;
    let contadorDestacados  = [];
    this.favoritoService.BuscarFavoritoByUsuario(this.usuarioLibro.id).subscribe(
      folioFavoritos =>{
        contadorDestacados = folioFavoritos.body;
        this.typesOfActions[5].contadorFolios = contadorDestacados.length;
      }
    );
    this.typesOfActions[0].contadorFolios = contadorBandeja;
    this.typesOfActions[1].contadorFolios = contadorFolioMandante.length;
    this.typesOfActions[2].contadorFolios = contadorFolioContratista.length;
    this.typesOfActions[3].contadorFolios = contadorSinRespuesta.length;
    this.typesOfActions[4].contadorFolios = contadorSinLeer.length;
    this.typesOfActions[6].contadorFolios = contadorBorradores.length;
    
    //this.contadorFolios[0].bandeja = contadorBandeja;
  }
  eliminarFavorito(folio : any){
    let existe = false;
    let idFolioExiste= null;
    let folioFavorito = new GesFavorito();
    folioFavorito.usuarioLibro = this.usuarioLibro;
    folioFavorito.folio = folio;
    folioFavorito.fechaCreacion = moment(Date.now());
    folioFavorito.nota = "";
    this.favoritoService.BuscarFavoritoByFolio(folio.id).subscribe(
      folioFavorito => {
        if(folioFavorito.body.length > 0 ){
          existe = true;
          idFolioExiste = folioFavorito.body[0].id;
        }else{
          existe = false;
        }
        setTimeout(() => {
          this.favoritoService.delete(idFolioExiste).subscribe(
            folioFavorito=>{
              let index = this.folios.indexOf(folio);
              this.indexEliminadoFavorito = [...this.indexEliminadoFavorito, folio];
              this.folios[index].existeFavorito = true;
              if(this.marcaTipoFiltroSideBar === 6 ){
                this.folios.splice(index, 1 );
                this.dataSource = new MatTableDataSource(this.folios);
                this.dataSource.paginator = this.paginator;
              }else{
                
              }
              this.getContadorFolioSideBar();
              Swal.fire("Eliminado!", "Favorito Eliminado Correctamente.", "success");
            }
          );
        }, 300);
      }
    );
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

  