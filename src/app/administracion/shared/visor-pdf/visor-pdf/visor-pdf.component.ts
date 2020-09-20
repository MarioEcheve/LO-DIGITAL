import { Component, OnInit, Inject, AfterViewInit } from "@angular/core";
import { NgxExtendedPdfViewerModule } from "ngx-extended-pdf-viewer";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from "@angular/material/dialog";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { element } from "protractor";
import { url } from "inspector";
import { ModalFirmaFolioComponent } from "src/app/administracion/folio/modal-firma-folio/modal-firma-folio.component";
import { Folio } from "src/app/administracion/TO/folio.model";
import { FolioService } from "src/app/administracion/services/folio.service";
import { Router } from "@angular/router";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import * as moment from "moment";
import { LibroService } from "src/app/administracion/services/libro.service";
import { UsuarioLibroService } from "src/app/administracion/services/usuario-libro.service";
import { NgxPermissionsService } from "ngx-permissions";
import { UsuarioLibro } from "src/app/administracion/TO/usuario-libro.model";
import { InformarPdfComponent } from "../../informar-pdf/informar-pdf.component";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { FolioReferencia } from "src/app/administracion/TO/folio-referencia.model";
import { FolioReferenciaService } from "src/app/administracion/services/folio-referencia.service";
declare var $: any;
@Component({
  selector: "app-visor-pdf",
  templateUrl: "./visor-pdf.component.html",
  styleUrls: ["./visor-pdf.component.css"],
})
export class VisorPdfComponent implements OnInit, AfterViewInit {
  folio = new Folio();
  usuario;
  mostrar="";
  muestraAcciones;
  constructor(
    public dialogRef: MatDialogRef<VisorPdfComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private folioService: FolioService,
    private router: Router,
    private libroService: LibroService,
    private usuarioLibroService : UsuarioLibroService,
    private permissionsService : NgxPermissionsService,
    private folioReferenciaService : FolioReferenciaService
  ) {}

  ngOnInit(): void {
    console.log(this.data);
    //this.mostrar = t
    let usuarioActual = JSON.parse(localStorage.getItem("user"));
    setTimeout(() => {
      let idLibro =  this.data.folio.libro.id;
      this.getPermisos(idLibro, usuarioActual.id);
    }, 300);
  }
  ngAfterViewInit() {
    if(this.data.previsualisar === true){
      if(this.data.lectura === false){
        this.muestraAcciones =1;
        this.folio = this.data.folio;
        this.usuario = this.data.usuario;
        this.data.pdfArchivoCompleto.getBlob((blob) => {
          blobToBase64(blob).then((res: string) => {
            var documento = res.split(",");
            var aux = documento[0].split("data:");
            var tipoDocumento = aux[1].split(";");
            this.folio.pdfFirmado = documento[1];
            this.folio.pdfFirmadoContentType = tipoDocumento[0];
          });
        });
      }else{
        this.muestraAcciones =3;
        this.folio = this.data.folio;
        this.usuario = this.data.usuario;
        this.folioService.find(this.folio.id).subscribe(
          respuesta => {
            let pdfLectura = respuesta.body.pdfFirmado;
            let contentType = respuesta.body.pdfFirmadoContentType;
            this.folio.pdfLectura = pdfLectura;
            this.folio.pdfLecturaContentType = contentType;
          }
        );
      }
    }else{
      this.muestraAcciones = 4;
    }
  
  }
  modalFirmarFolio() {
    const dialogRef = this.dialog.open(ModalFirmaFolioComponent, {
      width: "440px",
      height: "195px",
      data: { folio : this.folio , lectura : this.data.lectura }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === null || result === "" || result === undefined) {
      } else {
        this.folioService
          .correlativoFolio(this.folio.libro.id)
          .subscribe((respuesta) => {
            if(this.data.listaUsuariosCambioAdmin.length > 0 ){
              let adminActual = new UsuarioLibro();
              adminActual =  this.data.listaUsuariosCambioAdmin[0];
              let adminNuevo = new UsuarioLibro();
              adminNuevo =  this.data.listaUsuariosCambioAdmin[1];
              adminActual.adminActivo = false;
              adminActual.perfilUsuarioLibro = {id: 1801, nombre: "Administrador", usuarioLibros: null}
              adminNuevo.adminActivo = true;
              this.usuarioLibroService.update(adminActual).subscribe();
              this.usuarioLibroService.update(adminNuevo).subscribe();
            }
            this.folio.estadoFolio = true;
            this.folio.asunto = this.data.folio.asunto;
            this.folio.fechaFirma = moment(Date.now());
            if(this.data.lectura === true){
              this.folio.idUsuarioLectura = this.usuario.id;
              this.folio.estadoLectura = true;
              this.folio.poseeFolioReferencia = this.data.folio.poseeFolioReferencia;
            }else{
              this.folio.idUsuarioFirma = this.usuario.id;
              this.folio.numeroFolio = respuesta.body[0].numero_folio;
            }

            if(this.data.folioReferencias.length > 0 ){
              this.folio.poseeFolioReferencia = true;
              for (let i = 0; i < this.data.folioReferencias.length; i++) {
                let folioReferencia = new FolioReferencia();
                folioReferencia.idFolioReferencia = this.data.folioReferencias[i].id;
                folioReferencia.idFolioOrigen = this.folio.id;
                folioReferencia.asunto = `Folio Relacionado | asunto : ${this.data.folio.asunto}`;
                this.folioReferenciaService
                  .create(folioReferencia)
                  .subscribe((respuesta2) => {
                    this.folio.poseeFolioReferencia = true;
                    this.folio.folioReferencias = [];
                    this.folio.folioReferencias.push(respuesta2.body);
                    this.folio.asunto = this.data.folio.asunto;
                    this.folioService.update(this.folio).subscribe();
                    
                  });
              }
            }else{
              this.folio.asunto = this.data.folio.asunto;
              this.folio.poseeFolioReferencia = this.data.folio.poseeFolioReferencia;
              this.folioService.update(this.folio).subscribe();
            }
            this.folio.libro.fechaCreacion = moment(
              this.folio.libro.fechaCreacion
            );
            this.folio.idUsuarioFirma = this.usuario.id;
            this.usuarioLibroService.query().subscribe(
              usuario => {
                let usuariosMandante = usuario.body.filter(usuariosMandante => usuariosMandante.usuarioDependencia.dependencia.id === this.folio.libro.contrato.dependenciaMandante.id );
                usuariosMandante = usuariosMandante.filter(usuarioMandante => usuarioMandante.id === this.folio.idUsuarioFirma);
                if(usuariosMandante.length > 0){
                  this.folio.entidadCreacion = true;
                }else{
                  this.folio.entidadCreacion = false;
                }
              }
            );
            if(this.folio.requiereRespuesta === true){
              this.folio.estadoRespuesta = {id: 1952, nombre: "Pendiente", folios: null}
            }else{
              this.folio.estadoRespuesta =null;
            }
            // cuando venga un folio con respuesta, actualiza el folio origen
            setTimeout(() => {
              if(this.folio.idFolioRelacionado!==null){
                this.folioService.find(this.folio.idFolioRelacionado).subscribe(
                  respuesta=>{
                    respuesta.body.estadoRespuesta = {id: 1951, nombre: "Respondido", folios: null};
                    this.folioService.update(respuesta.body).subscribe();
                  }
                );
            }
            if(this.data.lectura === false){
              this.folioService.update(this.folio).subscribe((respuesta) => {
                if(this.folio.tipoFolio.nombre.toLowerCase() === "apertura libro") {
                    this.folio.libro.estadoLibro = {
                    id:  2201,
                    nombre: "Abierto",
                    libros: null,
                  };
                  this.folio.libro.fechaApertura = moment(Date.now());
                  this.libroService.update(this.folio.libro).subscribe();
                }
                if(this.folio.tipoFolio.nombre.toLowerCase() === "cierre libro") {
                    this.folio.libro.estadoLibro = {
                      id:  2202,
                      nombre: "Cerrado",
                      libros: null,
                    };
                  this.folio.libro.fechaCierre = moment(Date.now());
                  this.folio.libro.fechaApertura = moment(this.folio.libro.fechaApertura);
                  this.libroService.update(this.folio.libro).subscribe();
                }
                this.muestraAcciones = 2;
                this.mostrarAlertaLoaderFirmasFolio();
              });
            }else{
              this.dialogRef.close();
              this.dialogRef.beforeClosed().subscribe((respuesta) => {
                console.log(this.folio);
                this.folio.poseeFolioReferencia = this.data.folio.poseeFolioReferencia;
                
                this.folioService.update(this.folio).subscribe();
                
                this.showNotificationSuccessLectura("top", "right");
              });
            }
            }, 700);
          });
      }
    });
  }
  showNotificationSuccess(from: any, align: any) {
    const type = [
      "",
      "info",
      "success",
      "warning",
      "danger",
      "rose",
      "primary",
    ];

    const color = 2;

    $.notify(
      {
        icon: "notifications",
        message: "Folio Firmado Correctamente ",
      },
      {
        type: type[color],
        timer: 3000,
        placement: {
          from: from,
          align: align,
        },
        template:
          '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0} alert-with-icon" role="alert">' +
          '<button mat-raised-button type="button" aria-hidden="true" class="close" data-notify="dismiss">  <i class="material-icons">close</i></button>' +
          '<i class="material-icons" data-notify="icon">notifications</i> ' +
          '<span data-notify="title">{1}</span> ' +
          '<span data-notify="message">{2}</span>' +
          '<div class="progress" data-notify="progressbar">' +
          '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
          "</div>" +
          '<a href="{3}" target="{4}" data-notify="url"></a>' +
          "</div>",
      }
    );
  }
  showNotificationSuccessLectura(from: any, align: any) {
    const type = [
      "",
      "info",
      "success",
      "warning",
      "danger",
      "rose",
      "primary",
    ];

    const color = 2;

    $.notify(
      {
        icon: "notifications",
        message: "Lectura Folio Firmado Correctamente ",
      },
      {
        type: type[color],
        timer: 3000,
        placement: {
          from: from,
          align: align,
        },
        template:
          '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0} alert-with-icon" role="alert">' +
          '<button mat-raised-button type="button" aria-hidden="true" class="close" data-notify="dismiss">  <i class="material-icons">close</i></button>' +
          '<i class="material-icons" data-notify="icon">notifications</i> ' +
          '<span data-notify="title">{1}</span> ' +
          '<span data-notify="message">{2}</span>' +
          '<div class="progress" data-notify="progressbar">' +
          '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
          "</div>" +
          '<a href="{3}" target="{4}" data-notify="url"></a>' +
          "</div>",
      }
    );
  }
  getPermisos(idLibro, idUsuario){
    this.usuarioLibroService
      .buscarlibroPorContrato(idLibro, idUsuario)
      .subscribe((respuesta) => {
        this.usuario = respuesta.body[0];
        let permisos = [respuesta.body[0].perfilUsuarioLibro.nombre.toLowerCase()];
        this.permissionsService.loadPermissions(permisos);
      });
  }

  informar(){
    const dialog = this.dialog.open(InformarPdfComponent, {
      width : '500'
    });
    dialog.afterClosed().subscribe((result) => {
      if (result === null || result === "" || result === undefined) {

      }else{
        this.dialogRef.close();
      }
    });
    
  }
  mostrarAlertaLoaderFirmasFolio(){
    let timerInterval
    Swal.fire({
      title: 'Procesando firma de folio',
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
        clearInterval(timerInterval);
        this.router.navigate([
          "/folio/folio-firmado",
          this.folio.id,
        ]);
        Swal.fire("Creado!", "Folio Firmado Correctamente.", "success");
      }
    }).then((result) => {
      /* Read more about handling dismissals below */
      if (result.dismiss === Swal.DismissReason.timer) {
      }
  })
  }

}
const blobToBase64 = (blob) => {
  const reader = new FileReader();
  reader.readAsDataURL(blob);
  return new Promise((resolve) => {
    reader.onloadend = () => {
      resolve(reader.result);
    };
  });
};
