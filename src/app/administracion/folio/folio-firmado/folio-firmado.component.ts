import { Component, OnInit, AfterViewInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FolioService } from "../../services/folio.service";
import { Folio } from "../../TO/folio.model";
import { DependenciaService } from "../../services/dependencia.service";
import { UsuarioLibroService } from "../../services/usuario-libro.service";
import { ModalCrearFolioComponent } from "../modal-crear-folio/modal-crear-folio.component";
import { MatDialog } from "@angular/material/dialog";
import { ContratoService } from "../../services/contrato.service";
import { Libro } from "../../TO/libro.model";
import { Contrato } from "../../TO/contrato.model";
import { LibroService } from "../../services/libro.service";
import { VisorPdfComponent } from "../../shared/visor-pdf/visor-pdf/visor-pdf.component";
import { UsuarioDependencia } from "../../TO/usuario-dependencia.model";
import { UsuarioDependenciaService } from "../../services/usuario-dependencia.service";
import { NgxPermissionsService } from "ngx-permissions";
import { ArchivoService } from "../../services/archivo.service";
import { Archivo } from "../../TO/archivo.model";
import { InformarPdfComponent } from '../../shared/informar-pdf/informar-pdf.component';
import Swal from "sweetalert2/dist/sweetalert2.js";
declare var $: any;
declare interface TableData {
  headerRow: string[];
  dataRows: string[][];
}
@Component({
  selector: "app-folio-firmado",
  templateUrl: "./folio-firmado.component.html",
  styleUrls: ["./folio-firmado.component.css"],
})
export class FolioFirmadoComponent implements OnInit {
  public tableData1: TableData;
  Folio = new Folio();
  dependenciaMandante;
  contrato = new Contrato();
  libros: Libro[] = [];
  idlibroRelacionado =null;;
  folioRelacionado=  new Folio();
  listaArchivos:Archivo[] = [];
  respuestaFolioShow = false;
  emisor;
  receptor;
  usuario;
  cities = [
    { value: "paris-0", viewValue: "Paris" },
    { value: "miami-1", viewValue: "Miami" },
    { value: "bucharest-2", viewValue: "Bucharest" },
    { value: "new-york-3", viewValue: "New York" },
    { value: "london-4", viewValue: "London" },
    { value: "barcelona-5", viewValue: "Barcelona" },
    { value: "moscow-6", viewValue: "Moscow" },
  ];
  constructor(
    private route: ActivatedRoute,
    private folioService: FolioService,
    private dependenciaService: DependenciaService,
    private usuarioLibroService: UsuarioLibroService,
    private router: Router,
    private dialog: MatDialog,
    private contratoService : ContratoService,
    private libroService : LibroService,
    private UsuarioDependenciaService : UsuarioDependenciaService,
    private permissionsService : NgxPermissionsService,
    private archivoService : ArchivoService,
    
  ) {}
  ngOnInit() {
    this.folioService.navBarChange(2);
    let idFolio = this.route.snapshot.paramMap.get("id");
    this.obtenerFolio(idFolio);
    this.getArchivosFolio(idFolio);
    this.tableData1 = {
      headerRow: ["#", "Name", "Job Position", "Since", "Salary", "Actions"],
      dataRows: [
        ["1", "Andrew Mike", "Develop", "2013", "99,225", ""],
        ["2", "John Doe", "Design", "2012", "89,241", "btn-round"],
        ["3", "Alex Mike", "Design", "2010", "92,144", "btn-link"],
        ["4", "Mike Monday", "Marketing", "2013", "49,990", "btn-round"],
        ["5", "Paul Dickens", "Communication", "2015", "69,201", ""],
      ],
    };
   
  }
  obtenerFolio(idFolio) {
    this.folioService.find(idFolio).subscribe((respuesta) => {
      this.Folio = respuesta.body;
      console.log(this.Folio);
      let usuarioActual =JSON.parse(localStorage.getItem("user"));
      this.obtenerPerfilLibroUsuario(this.Folio.libro.id, usuarioActual.id);
      this.idlibroRelacionado = respuesta.body.idFolioRespuesta;
      
      if(respuesta.body.idFolioRelacionado !== null){
        this.folioService.find(respuesta.body.idFolioRelacionado).subscribe(
          folioRelacionado=>{
            this.folioRelacionado = folioRelacionado.body;
          }
        );
      }
      this.obtenerEmisorFolio(respuesta.body.idUsuarioFirma);
      this.obtenerReceptorFolio(respuesta.body.idReceptor);
      this.dependenciaService
        .find(respuesta.body.libro.contrato.idDependenciaContratista)
        .subscribe((respuesta) => {
          this.dependenciaMandante = respuesta.body;
        });
        
        this.contratoService.find(this.Folio.libro.contrato.id).subscribe((respuesta) => {
          this.contrato = respuesta.body;
          this.libroService
            .buscarlibroPorContrato(respuesta.body.id)
            .subscribe((respuesta) => {
              this.libros = respuesta.body;
            });
        });
    });

  }
  obtenerEmisorFolio(idEmisor) {
    this.usuarioLibroService.find(idEmisor).subscribe((respuesta) => {
      console.log(respuesta.body);
      this.emisor = respuesta.body;
    });
  }
  obtenerReceptorFolio(idReceptor) {
    this.usuarioLibroService.find(idReceptor).subscribe((respuesta) => {
      console.log(respuesta.body);
      this.receptor = respuesta.body;
    });
  }
  volverListaFolios() {
    this.router.navigate([
      "/folio/folio/",
      this.Folio.libro.contrato.id,
      this.Folio.libro.id,
    ]);
  }
  responderFolio(){
    let usuario = JSON.parse(localStorage.getItem("user"));
    let perfilUsuario = new UsuarioDependencia();
    this.UsuarioDependenciaService.findUserByUsuarioDependencia(usuario.id).subscribe(
      usuarioDependencia=>{
        perfilUsuario = usuarioDependencia.body[0];
        if(perfilUsuario.nombre?.toLowerCase() === "administrador"){
          this.libroService.getMisLibros(usuario.id).subscribe(
            respuesta => {
              console.log(respuesta.body);
              this.libros = respuesta.body;
            }
          );
        }else{
          this.libroService.getMisLibrosContratoDetalle(usuario.id, this.contrato.id).subscribe(
            libros=>{
              console.log(libros.body);
              this.libros = libros.body;
            }
          );
        }
      }
    );
    setTimeout(() => {
      const dialogRef = this.dialog.open(ModalCrearFolioComponent, {
      
        width: "40%",
        height: "50%%",
        data: {
          libros: this.libros,
          libroSeleccionado: this.Folio.libro,
          habilitar : true,
          folio : this.Folio
        },
      });
    }, 500);
    
    /*
    let usuario = JSON.parse(localStorage.getItem("user"));
    this.obtenerPerfilLibroUsuario(this.idlibro, usuario.id);
    this.router.navigate(["/folio/folio-borrador/", this.idlibro, usuario.id]);
    */
  }
  lecturaFolio(){
    this.folioService.find(this.Folio.id).subscribe(
      folioOrigen => {
        console.log(folioOrigen);
        let pdf = folioOrigen.body.pdfFirmado;
        let contentType = folioOrigen.body.pdfFirmadoContentType;
        let url = "data:"+contentType+";base64,"+pdf;
        let promise = new Promise(function (resolve, reject) {
          fetch(url)
          .then(res => {
            return res.blob();
          })
          .then(blob => {
            console.log(blob);
            resolve(URL.createObjectURL(blob));
          });
        });
        promise.then((resultado) => {
          console.log(resultado);
          const dialogRef = this.dialog.open(VisorPdfComponent, {
            width: "100%",
            height: "90%",
            data: {
              pdf: resultado,
              folio: this.Folio,
              usuario: this.usuario,
              pdfArchivoCompleto: null,
              previsualisar : true,
              lectura : true
            },
          });
        });
      });
  }
  // este metodo permite buscar el usuario usuario libro por el idusuario y el id del libro
  // luego setea los permisos para ejecutar acciones
  async obtenerPerfilLibroUsuario(idLibro, idUsuario) {
    this.usuarioLibroService
      .buscarlibroPorContrato(idLibro, idUsuario)
      .subscribe((respuesta) => {
        console.log(respuesta.body);
        this.usuario = respuesta.body[0];
        console.log(respuesta.body[0].perfilUsuarioLibro.nombre.toLowerCase());
        let permisos = [respuesta.body[0].perfilUsuarioLibro.nombre.toLowerCase()];
        this.permissionsService.loadPermissions(permisos);
        this.usuarioLibroService.find(this.Folio.idReceptor).subscribe(
            response=>{ 
              console.log(response.body);
              if(respuesta.body[0].usuarioDependencia?.dependencia.id === response.body.usuarioDependencia?.dependencia.id){
                this.respuestaFolioShow = true;
              }else{
                this.respuestaFolioShow = false;
              }
            }
        );
      });
  }
  async getArchivosFolio(idFolio){
    let response = await this.archivoService.AchivosPorFolio(idFolio).subscribe(
      respuesta=>{
        this.listaArchivos = respuesta.body;
        console.log(this.listaArchivos);
      }
    );
    return response;
  }
  openFile(contentType: string, base64String: string , nombreArchivo : any ): void {
    const blob = b64toBlob(base64String, contentType);
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = nombreArchivo;
    document.body.appendChild(link);
    link.dispatchEvent(
      new MouseEvent('click', { 
        bubbles: true, 
        cancelable: true, 
        view: window 
      })
    );
    // Remove link from body
    document.body.removeChild(link);
    console.log(blobUrl)
  }
  async navegateFolioRespuesta(folioRelacionado){
    let timerInterval
    Swal.fire({
      title: 'Buscando folio respuesta',
      html: 'Esto puede tardar unos segundos...',
      timer: 2000,
      timerProgressBar: true,
      onBeforeOpen: () => {
        Swal.showLoading()
        timerInterval = setInterval(() => {
          const content = Swal.getContent()
          if (content) {
            const b = content.querySelector('b')
            if (b) {
              b.textContent = Swal.getTimerLeft()
            }
          }
        }, 100)
      },
      onClose: () => {
        clearInterval(timerInterval)
      }
    }).then((result) => {
      /* Read more about handling dismissals below */
      if (result.dismiss === Swal.DismissReason.timer) {
        console.log('I was closed by the timer')
      }
      this.obtenerFolio(folioRelacionado.id);
      this.getArchivosFolio(folioRelacionado.id);
  })  
  }
  informar(){
    this.dialog.open(InformarPdfComponent, {
      width: "500px",
      height: "310px",
      
    })
  }
}
const b64toBlob = (b64Data, contentType='', sliceSize=512) => {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, {type: contentType});
  return blob;
}