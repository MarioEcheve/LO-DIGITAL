import { Component, OnInit, Input, ViewChild, ElementRef } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { LibroService } from "../../services/libro.service";
import { ILibro, Libro } from "../../TO/libro.model";
import { DependenciaService } from "../../services/dependencia.service";
import { IDependencia, Dependencia } from "../../TO/dependencia.model";
import { ITipoFolio } from "../../TO/tipo-folio.model";
import { TipoFolioService } from "../../services/tipo-folio.service";
import { AngularEditorConfig } from "@kolkov/angular-editor";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FolioService } from "../../services/folio.service";
import * as moment from "moment";
import { MatDialog } from "@angular/material/dialog";
import { ModalFirmaFolioComponent } from "../modal-firma-folio/modal-firma-folio.component";
import { DatePipe } from "@angular/common";
import { Folio, IFolio } from "../../TO/folio.model";
import { UsuarioLibroService } from "../../services/usuario-libro.service";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { VisorPdfComponent } from "../../shared/visor-pdf/visor-pdf/visor-pdf.component";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { ModalBuscarFolioComponent } from "../modal-buscar-folio/modal-buscar-folio.component";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { MatChipInputEvent } from "@angular/material/chips";
import { FolioReferenciaService } from "../../services/folio-referencia.service";
import { FolioReferencia } from "../../TO/folio-referencia.model";
import { element, promise } from "protractor";
import { NgxPermissionsService } from "ngx-permissions";
import { CambioAdministradorComponent } from "../../shared/cambio-administrador/cambio-administrador.component";
import htmlToPdfmake from "html-to-pdfmake";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import htmlToImage from "html-to-image";
import { UsuarioLibro } from "../../TO/usuario-libro.model";
import { Archivo } from "../../TO/archivo.model";
import { ArchivoService } from "../../services/archivo.service";
import { Img } from "pdfmake-wrapper";
import { async } from "@angular/core/testing";
import { HttpEvent } from "@angular/common/http";
import { resolve } from "path";

declare var $: any;
declare interface TableData {
  headerRow: string[];
  dataRows: string[][];
}

@Component({
  selector: "app-folio-detalle",
  templateUrl: "./folio-detalle.component.html",
  styleUrls: ["./folio-detalle.component.css"],
})
export class FolioDetalleComponent implements OnInit {
  public tableData1: TableData;
  libro = new Libro();
  Folio = new Folio();
  src;
  dependenciaContratista = new Dependencia();
  // implementacion de administrador de archivos folios
  filesArray = [];
  showFileArray: [];
  //------------------------------
  tipoFolio: ITipoFolio[];
  tipoFolioSeleccionado: any = "";
  muestraFechaRequerida = false;
  base64textString: string = "";
  usuario;
  muestraImagenes = false;
  muestraRespuestaReferenciaFechaRequerida = true;
  necesitaRespuesta = false;
  folioSiguiente;
  receptor = [];
  multipleConfig = "";
  folioRelacionado: IFolio;
  archivosFolio = [];
  editarArchivosFolios = false;
  private fechaRequeridaValidators = [Validators.maxLength(250)];
  // variables utilizadas para pintar el pdf
  receptorPdf = new UsuarioLibro();
  emisorPdf = new UsuarioLibro();
  correlativoPdf = 0;
  tipoFolioPdf;
  respuestaPdf;
  asuntoPdf;
  referenciaPdf;
  anotacionPdf;

  // VARIABLE PARA MOSTRAR CAMBIO DE ADMIN
  muestraCambioAdmin = false;
  // IMPLEMENTACION CONFIG ANGULAR-EDITOR
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: "15rem",
    minHeight: "5rem",
    placeholder: "Enter text here...",
    translate: "no",
    defaultParagraphSeparator: "br",
    defaultFontName: "Arial",
    sanitize: false,
    //toolbarHiddenButtons: [["bold"]],
    customClasses: [
      {
        name: "quote",
        class: "quote",
      },
      {
        name: "redText",
        class: "redText",
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ],
  };
  //IMPLEMENTACION CONFIG SUMMER NOTE 
  config = {
    placeholder: '',
    tabsize: 2,
    height: '200px',
    //uploadImagePath: '/api/upload',
    toolbar: [
        ['misc', ['undo', 'redo']],        
        ['font', ['bold', 'italic', 'underline', 'strikethrough', 'clear']],
        ['fontsize', ['fontname', 'fontsize', 'color']],
        ['para', ['ul', 'ol', 'paragraph', 'height']],
        ['insert', ['table', 'picture', 'link', 'hr']]
    ],
    fontNames: ['Helvetica', 'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Roboto', 'Times']
  }
  // implementacion de chips
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  folios: any[] = [];
  listaUsuariosCambioAdmin = [];
  cities = [
    { value: "paris-0", viewValue: "Paris" },
    { value: "miami-1", viewValue: "Miami" },
    { value: "bucharest-2", viewValue: "Bucharest" },
    { value: "new-york-3", viewValue: "New York" },
    { value: "london-4", viewValue: "London" },
    { value: "barcelona-5", viewValue: "Barcelona" },
    { value: "moscow-6", viewValue: "Moscow" },
  ];
  // forms
  folioForm: FormGroup;
  // implementacion upload archivos 
  @ViewChild("fileUpload", { static: false }) fileUpload: ElementRef; files = [];
  value = 0;
  subirArchivosNuevos = false
  archivosFolioGCP = [];
  subiendoArchivos = false;
  constructor(
    private route: ActivatedRoute,
    private libroService: LibroService,
    private dependenciaService: DependenciaService,
    private tipoFolioService: TipoFolioService,
    private fb: FormBuilder,
    private folioService: FolioService,
    private router: Router,
    private dialog: MatDialog,
    private datePipe: DatePipe,
    private usuarioLibroService: UsuarioLibroService,
    private folioReferenciaService: FolioReferenciaService,
    private permissionsService: NgxPermissionsService,
    private archivoService: ArchivoService
  ) {
    this.folioService.removeFolioReferencia(new Folio(), false);
    this.folios = [];
    this.folioService.navBarChange(2);
  }

  ngOnInit() {
    this.obtenerTipoFolio();
    this.folioForm = this.fb.group({
      id: [],
      asunto: ["", Validators.required],
      entidadCreacion: [null],
      estadoFolio: [false],
      estadoLectura: [null],
      estadoRespuesta: [null],
      fechaCreacion: [null],
      fechaFirma: [null],
      fechaLectura: [null],
      fechaModificacion: [null],
      fechaRequerida: [false],
      libro: [""],
      requiereRespuesta: [false],
      tipoFolio: ["", Validators.required],
      anotacion: ["", Validators.required],
      numeroFolio: [],
      emisor: [],
      usuarioPerfilLibro: [],
      usuarioNombre: [],
      perfilUsuario: [],
      respuestaFolio: [""],
      fechaRequeridaDatepicker: ["", this.fechaRequeridaValidators],
      folioReferencia: [],
      receptor: [null, Validators.required],
      cambioAdmin: ["Cambio Administrador"],
      archivos: [],
    });
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
    let idFolio = this.route.snapshot.paramMap.get("id");

    this.buscarFolio(idFolio);
    this.achivosPorFolio(idFolio);

    this.folioService
      .getListaFoliosRelacionadosAgregadosSubject()
      .subscribe((respuesta) => {
        if (respuesta.length === 0) {
          //this.folioService.removeFolioReferencia(new Folio, false);
          //this.folioService.AgregarFolioReferenciaAlista(new Folio, true , []);
          this.folios = [];
        } else {
          if (this.folios.length > 0) {
            let hash = {};
            this.folios = respuesta;
            this.folios = this.folios.filter((o) =>
              hash[o.id] ? false : (hash[o.id] = true)
            );
          } else {
            if (respuesta.length === 1) {
              this.folios = respuesta;
            } else {
              let hash = {};
              this.folios = respuesta.filter((o) =>
                hash[o.id] ? false : (hash[o.id] = true)
              );
            }
          }
        }
      });
  }
  buscarFolio(id) {
    let usuarioActual = JSON.parse(localStorage.getItem("user"));
    this.folioService.find(id).subscribe((respuesta) => {
      this.Folio = respuesta.body;
      this.correlativoFolio(this.Folio.libro.id);
      this.usuarioLibroService
        .ListaUsuariosLibros(respuesta.body.libro.id, usuarioActual.id)
        .subscribe((respuesta) => {
          //this.receptor = respuesta.body;
          let administradores = respuesta.body.filter(usuarios => usuarios.perfilUsuarioLibro.nombre.toLowerCase() === "administrador")
          this.receptor = administradores;
        });
      this.folioService
        .foliosReferencias(respuesta.body.id)
        .subscribe((respuesta) => {
          this.folios = [];
          this.Folio.folioReferencias = respuesta.body.folioReferencias;
          if (this.Folio.folioReferencias.length > 0) {
            this.referenciaPdf = this.folios;
          } else {
            this.referenciaPdf = "n/a";
          }
          this.Folio.folioReferencias.forEach((element) => {
            this.folioService
              .find(element.idFolioReferencia)
              .subscribe((folioReferencia) => {
                this.folios = [...this.folios, folioReferencia.body];
                this.folioService.AgregarFolioReferenciaAlista(
                  folioReferencia.body
                );
              });
          });
        });
      setTimeout(() => {
        this.folioService.AgregarFolioReferenciaAlista(
          new Folio(),
          true,
          this.folios
        );
      }, 1000);
      this.buscaCorrelativoFolio();

      this.obtenerPerfilLibroUsuario(this.Folio.libro.id, usuarioActual.id);
      this.asuntoPdf = respuesta.body.asunto;
      this.anotacionPdf = respuesta.body.anotacion;
      this.folioForm.controls["asunto"].setValue(respuesta.body.asunto);
      this.folioForm.controls["anotacion"].setValue(respuesta.body.anotacion);
      this.folioForm.controls["requiereRespuesta"].setValue(
        respuesta.body.requiereRespuesta
      );
      this.folioForm.controls["receptor"].setValue(respuesta.body.idReceptor);
      if (this.folioForm.controls["requiereRespuesta"].value === false) {
        this.muestraFechaRequerida = false;
        if (respuesta.body.idFolioRelacionado !== null) {
          this.necesitaRespuesta = true;
          this.folioService
            .find(respuesta.body.idFolioRelacionado)
            .subscribe((folioRelacionado) => {
              this.folioForm.controls["respuestaFolio"].setValue(
                "" +
                folioRelacionado.body.libro.nombre +
                " | " +
                "Folio : " +
                folioRelacionado.body.numeroFolio
              );
              this.respuestaPdf = this.folioForm.controls[
                "respuestaFolio"
              ].value;
              this.folioRelacionado = folioRelacionado.body;
            });
        }
      } else {
        if (respuesta.body.fechaRequerida !== undefined) {
          
          this.folioForm.controls["fechaRequeridaDatepicker"].setValue(
            this.Folio.fechaRequerida.toDate()
          );
         
        }
        this.muestraFechaRequerida = true;
      }
      let tipo = this.folioForm.controls["tipoFolio"].setValue(
        respuesta.body.tipoFolio
      );
      this.tipoFolioPdf = respuesta.body.tipoFolio;
      if (respuesta.body.tipoFolio.nombre.toLocaleLowerCase() === "apertura libro") {
        let tipo = this.tipoFolio.filter((tipo) => {
          return tipo.nombre.toLowerCase() === "apertura libro";
        });
        this.tipoFolio = tipo;
        this.muestraRespuestaReferenciaFechaRequerida = false;
        this.necesitaRespuesta = false;
      } else {
        if (
          respuesta.body.tipoFolio.nombre.toLocaleLowerCase() ===
          "cambio administrador"
        ) {
          this.muestraCambioAdmin = true;
        }

        let tipo = this.tipoFolio.filter((tipo) => {
          return tipo.nombre.toLowerCase() !== "apertura libro";
        });
        this.tipoFolio = tipo;
      }
      if (respuesta.body.libro.tipoLibro.descripcion.toLowerCase() === "maestro") {
        this.tipoFolio = this.tipoFolio.filter(folio => folio.visibleMaestro === true);
      }
      if (respuesta.body.libro.tipoLibro.descripcion.toLowerCase() === "auxiliar") {
        this.tipoFolio = this.tipoFolio.filter(folio => folio.visibleAuxliar === true);
      }

      this.folioForm.controls["fechaCreacion"].setValue(
        this.datePipe.transform(
          respuesta.body.fechaCreacion,
          "dd-MM-yyyy HH:mm"
        )
      );
      this.folioForm.controls["fechaModificacion"].setValue(
        this.datePipe.transform(
          respuesta.body.fechaModificacion,
          "dd-MM-yyyy HH:mm"
        )
      );
      this.folioForm.controls["id"].setValue(respuesta.body.id);
      this.folioForm.controls["tipoFolio"].setValue(
        respuesta.body.tipoFolio.nombre
      );
      this.libro = respuesta.body.libro;
      this.dependenciaService
        .find(respuesta.body.libro.contrato.idDependenciaContratista)
        .subscribe((respuesta) => {
          this.dependenciaContratista = respuesta.body;
        });
      this.usuarioLibroService
        .find(respuesta.body.idUsuarioCreador)
        .subscribe((respuesta) => {
          this.emisorPdf = respuesta.body;
          this.folioForm.controls["emisor"].setValue(
            respuesta.body.usuarioDependencia.usuario.firstName +
            " " +
            respuesta.body.usuarioDependencia.usuario.lastName
          );
          this.folioForm.controls["usuarioPerfilLibro"].setValue(
            respuesta.body.perfilUsuarioLibro.nombre
          );
        });
      if (respuesta.body.idReceptor !== null) {
        this.usuarioLibroService
          .find(respuesta.body.idReceptor)
          .subscribe((receptor) => {
            this.receptorPdf = receptor.body;
          });
      }
    });
    // desabilitamos los inputs del form
    this.folioForm.controls["fechaModificacion"].disable();
    this.folioForm.controls["fechaCreacion"].disable();
    this.folioForm.controls["emisor"].disable();
    this.folioForm.controls["usuarioPerfilLibro"].disable();
    this.folioForm.controls["respuestaFolio"].disable();
    this.folioForm.controls["folioReferencia"].disable();
    this.folioForm.controls["cambioAdmin"].disable();
  }
  obtenerTipoFolio() {
    this.tipoFolioService.query().subscribe((respuesta) => {
      this.tipoFolio = respuesta.body;
    });
  }
  guardarFolio() {
    this.Folio.fechaModificacion = moment(Date.now());
    this.Folio.libro = this.libro;
    this.Folio.anotacion = this.folioForm.controls["anotacion"].value;
    this.Folio.asunto = this.folioForm.controls["asunto"].value;
    this.Folio.idUsuarioCreador = this.usuario.id;
    this.Folio.idReceptor = this.folioForm.controls["receptor"].value;
    this.Folio.archivos = [];
    this.Folio.estadoFolio = false;
    console.log(this.folioForm.controls["fechaRequeridaDatepicker"].value);
    if (this.folioForm.controls["fechaRequeridaDatepicker"].value !== "") {
      let fechaRequerida = moment(
        this.folioForm.controls["fechaRequeridaDatepicker"].value
      );
      this.Folio.fechaRequerida = fechaRequerida;
    } else {
      this.Folio.fechaRequerida = undefined;
    }
    if (this.tipoFolioSeleccionado !== "") {
      this.Folio.tipoFolio = this.tipoFolioSeleccionado;
    }
    this.folioService.update(this.Folio).subscribe(
      (respuesta) => {
        // guardar archivos
        if (this.editarArchivosFolios === false) {
          /*
          if (this.archivosFolio.length > 0) {
            this.archivosFolio.forEach((element) => {
              element.folio = respuesta.body;
              this.archivoService.create(element).subscribe(
                (respuesta) => {
                  let index = this.archivosFolio.indexOf(element);
                  this.archivosFolio[index].id = respuesta.body.id;
                },
                (existe) => {}
              );
            });
          }*/
        } else {
          /*
          this.archivosFolio.forEach((element) => {
            element.folio = respuesta.body;
            if (element.id !== undefined) {
              this.archivoService.update(element).subscribe();
            } else {
              this.archivoService.create(element).subscribe((respuesta) => {
                let index = this.archivosFolio.indexOf(element);
                this.archivosFolio[index].id = respuesta.body.id;
              });
            }
          });*/
        }
        console.log('imprimiendo folio referencia');
        console.log(this.folios);
        if (this.folios.length > 0) {
          for (let i = 0; i < this.folios.length; i++) {
            let folioReferencia = new FolioReferencia();
            folioReferencia.idFolioReferencia = this.folios[i].id;
            folioReferencia.idFolioOrigen = respuesta.body.id;
            respuesta.body.poseeFolioReferencia = true;
            folioReferencia.asunto = `Folio Relacionado | asunto : ${this.folios[i].asunto}`;
            this.folioReferenciaService
              .create(folioReferencia)
              .subscribe((respuesta2) => {
                respuesta.body.folioReferencias = [];
                respuesta.body.folioReferencias.push(respuesta2.body);
                this.folioService.update(respuesta.body).subscribe();
              });
          }
          setTimeout(() => {
            this.buscarFolio(respuesta.body.id);
            this.showNotificationSuccess("top", "right");
          }, 500);
          //this.folioRelacionadoService.create().subscribe();
        } else {
          setTimeout(() => {
            console.log('entra al');
            respuesta.body.poseeFolioReferencia = false;
            respuesta.body.folioReferencias = [];
            this.folioService.ListaFoliosDeFolios([]);
            this.folioService.update(respuesta.body).subscribe();
            setTimeout(() => {
              this.buscarFolio(respuesta.body.id);
            }, 1000);
            this.showNotificationSuccess("top", "right");
          }, 300);
        }
      },
      (error) => {
        this.showNotificationDanger("top", "right");
      }
    );
  }
  buscarFolioPorLibro(idLibro) {
    this.folioService.buscarFolioPorLibro(idLibro).subscribe((respuesta) => {
      if (respuesta.body.length <= 0) {
        this.tipoFolio = this.tipoFolio.filter(
          (tipo) => tipo.nombre.toLowerCase() === "apertura libro"
        );
        this.muestraCambioAdmin;
      } else {
        this.tipoFolio = this.tipoFolio.filter(
          (tipo) => tipo.nombre.toLowerCase() !== "apertura libro"
        );
      }
    });
  }
  firmarFolio() {
    const dialogRef = this.dialog.open(ModalFirmaFolioComponent, {
      width: "40%",
      height: "35%",
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === null) {
      } else {
        this.Folio.fechaFirma = moment(Date.now());
        this.Folio.libro = this.libro;
        this.Folio.anotacion = this.folioForm.controls["anotacion"].value;
        this.Folio.asunto = this.folioForm.controls["asunto"].value;
        this.Folio.idUsuarioCreador = this.usuario.id;
        this.Folio.idUsuarioFirma = this.usuario.id;
        this.Folio.fechaRequerida = this.Folio.fechaRequerida = moment(
          this.folioForm.controls["fechaRequeridaDatepicker"].value
        );
        this.Folio.estadoFolio = true;

        /*
        this.folioService
          .correlativoFolio(this.Folio.libro.id)
          .subscribe((respuesta) => {
            this.Folio.numeroFolio = respuesta.body[0].numero_folio;
          });

        this.folioService.update(this.Folio).subscribe(
          (respuesta) => {
            let libro = new Libro();
            libro = respuesta.body.libro;
            libro.fechaApertura = moment(Date.now());
            libro.fechaCreacion = moment(libro.fechaCreacion);
            this.libroService.update(libro).subscribe((respuesta) => {});
            this.showNotificationSuccess("top", "right");
            // actualizo el folio
            respuesta.body.numeroFolio = this.Folio.numeroFolio;
            this.folioService.update(respuesta.body).subscribe((respuesta) => {
              this.router.navigate([
                "/folio/folio/",
                this.libro.contrato.id,
                this.libro.id,
              ]);
            });
          },
          (error) => {
            this.showNotificationDanger("top", "right");
          }
        );
        */
      }
    });
  }
  ocultaFechaRequerida() {
    this.folioForm.controls["requiereRespuesta"].valueChanges.subscribe(
      (res) => {
        if (res) {
          this.muestraFechaRequerida = true;
          this.Folio.requiereRespuesta = true;
          let fechaRequerida = new Date();
          fechaRequerida.setDate(fechaRequerida.getDate() + 2);
          this.folioForm.get("fechaRequeridaDatepicker").setValue(fechaRequerida);
          this.folioForm
            .get("fechaRequeridaDatepicker")
            .setValidators([Validators.required]);
        } else {
          this.folioForm.get("fechaRequeridaDatepicker").clearValidators();
          this.muestraFechaRequerida = false;
          this.Folio.requiereRespuesta = false;
          this.folioForm.get("fechaRequeridaDatepicker").setValue("");
        }
      }
    );
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
        message: "Folio Actualizado Correctamente ",
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
  showNotificationDanger(from: any, align: any) {
    const type = [
      "",
      "info",
      "success",
      "warning",
      "danger",
      "rose",
      "primary",
    ];

    const color = 4;

    $.notify(
      {
        icon: "notifications",
        message: "Error al Actualizar el Folio",
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
  onUploadInit(event, archivos?: any) {
    if (!archivos) {
    }
  }

  obtenerPerfilLibroUsuario(idLibro, idUsuario) {
    this.usuarioLibroService
      .buscarlibroPorContrato(idLibro, idUsuario)
      .subscribe((respuesta) => {
        this.usuario = respuesta.body[0];
        let permisos = [
          respuesta.body[0].perfilUsuarioLibro.nombre.toLowerCase(),
        ];
        this.permissionsService.loadPermissions(permisos);
        if (this.usuario.perfilUsuarioLibro.nombre.toLowerCase() === "superior") {
          this.tipoFolio = this.tipoFolio.filter(
            (tipo) => tipo.nombre.toLowerCase() === "cambio administrador"
          );
        }
        if (this.usuario.perfilUsuarioLibro.nombre.toLowerCase() === "asistente") {
          this.tipoFolio = this.tipoFolio.filter(
            (tipo) => tipo.nombre.toLowerCase() !== "cambio administrador"
          );
        }
        if (respuesta.body[0].usuarioDependencia.dependencia.id === this.Folio.libro.contrato.dependenciaMandante.id) {
          this.tipoFolio = this.tipoFolio.filter(folio => folio.visibleMandante === true);
        } else {
          this.tipoFolio = this.tipoFolio.filter(folio => folio.visibleContratista === true);
        }
        this.folioForm.controls["usuarioNombre"].setValue(
          respuesta.body[0].usuarioDependencia.usuario.firstName +
          " " +
          respuesta.body[0].usuarioDependencia.usuario.lastName
        );
        this.folioForm.controls["perfilUsuario"].setValue(
          respuesta.body[0].perfilUsuarioLibro.nombre
        );
      });
  }
  eliminarFolio() {
    Swal.fire({
      title: "Esta Seguro ?",
      text: "Los cambios no podran ser revertidos!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Si, Eliminar folio!",
      cancelButtonText: "No, Mantener folio",
    }).then((result) => {
      if (result.value) {
        if (this.Folio.idFolioRelacionado !== null) {
          // valida si el folio es referenciado
          if (this.archivosFolio.length > 0) {
            this.archivosFolio.forEach((element) => {
              this.archivoService.delete(element.id).subscribe();
            });
          }
          if (this.folios.length > 0) {
            for (let i = 0; i < this.folios.length; i++) {
              this.folioService
                .find(this.folios[i].folioReferencias.idFolioOrigen)
                .subscribe((folioOrigen) => {
                  folioOrigen.body.folioReferencias = [];
                  this.folioService.update(folioOrigen.body).subscribe();
                });
            }
          }
          this.folioService
            .find(this.Folio.idFolioRelacionado)
            .subscribe((respuesta) => {
              respuesta.body.idFolioRespuesta = null;
              respuesta.body.estadoRespuesta = null;
              this.folioService
                .update(respuesta.body)
                .subscribe((respuesta2) => {
                  this.folioService
                    .delete(this.Folio.id)
                    .subscribe((respuesta) => {
                      Swal.fire(
                        "Eliminado!",
                        "Folio Eliminado Correctamente.",
                        "success"
                      );
                      // For more information about handling dismissals please visit
                      // https://sweetalert2.github.io/#handling-dismissals
                      this.router.navigate([
                        "/folio/folio/",
                        this.libro.contrato.id,
                        this.libro.id,
                      ]);
                    });
                });
            });
        } else {
          if (this.archivosFolio.length > 0) {
            this.archivosFolio.forEach((element) => {
              this.archivoService.delete(element.id).subscribe();
            });
          }
          setTimeout(() => {
            this.folioService.delete(this.Folio.id).subscribe((respuesta) => {
              Swal.fire(
                "Eliminado!",
                "Folio Eliminado Correctamente.",
                "success"
              );
              // For more information about handling dismissals please visit
              // https://sweetalert2.github.io/#handling-dismissals
              this.router.navigate([
                "/folio/folio/",
                this.libro.contrato.id,
                this.libro.id,
              ]);
            });
          }, 600);
        }
        /*
       
        */
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        //Swal.fire("Cancelado", "Your imaginary file is safe :)", "error");
      }
    });
  }
  volverListaFolios() {
    this.router.navigate([
      "/folio/folio/",
      this.Folio.libro.contrato.id,
      this.Folio.libro.id,
    ]);
  }
  valorTipoFolio(tipo) {
    this.tipoFolioSeleccionado = tipo;
    if (
      this.tipoFolioSeleccionado.nombre.toLowerCase() === "cambio administrador"
    ) {
      this.muestraCambioAdmin = true;
    } else {
      this.muestraCambioAdmin = false;
    }
  }
  
  async previsualizar() {
    let anotacion =  this.folioForm.controls["anotacion"].value;
    let usuarioLibroActual = this.usuario.usuarioDependencia.usuario.firstName + ' ' + this.usuario.usuarioDependencia.usuario.lastName;
    let object = {
      folio : this.Folio,
      mandante : '',
      contratista : this.dependenciaContratista,
      emisor : this.emisorPdf,
      receptor : this.receptorPdf,
      usuarioLibro : usuarioLibroActual,
      cargoUsuarioLibro : this.usuario.cargoFuncion
    };
    let body = htmlToPdfBorrador(anotacion,object);
    this.folioService.HtmlToPdf(body).subscribe(
      (response : any)=>{
        var url = "data:application/pdf;base64," + response;
        fetch(url)
        .then(res => res.blob())
        .then((file)=>{
          console.log(file)
          let pdfUrl = URL.createObjectURL(file);
          const dialogRef = this.dialog.open(VisorPdfComponent, {
            width: "100%",
            height: "95%",
            data: {
              pdf: pdfUrl,
              folio: this.Folio,
              usuario: this.usuario,
              pdfArchivoCompleto: file,
              previsualisar: true,
              lectura: false,
              listaUsuariosCambioAdmin: this.listaUsuariosCambioAdmin,
              folioReferencias: this.folios
            },
          });
          
        });
        
        // link.download = 'file.pdf';
        // link.dispatchEvent(new MouseEvent('click'));
        /*
        const dialogRef = this.dialog.open(VisorPdfComponent, {
          width: "100%",
          height: "95%",
          data: {
            pdf: response.file,
            folio: this.Folio,
            usuario: this.usuario,
            pdfArchivoCompleto: null,
            previsualisar: true,
            lectura: false,
            listaUsuariosCambioAdmin: this.listaUsuariosCambioAdmin,
            folioReferencias: this.folios
          },
        });
        */
      }
    );
    /*  
    let imagen = document.getElementById('imagenLogo1');
    let imagen2 = document.getElementById('imagenLogo2');
    let imagenBase64 = getBase64Image(imagen);
    let imagenBase642 = getBase64Image(imagen2);
    let respuestaFolio = "N/A";
    let fechaRequerida = this.folioForm.controls["fechaRequeridaDatepicker"].value;
    let usuarioLibroActual = this.usuario.usuarioDependencia.usuario.firstName + ' ' + this.usuario.usuarioDependencia.usuario.lastName;
    let foliosReferenciaText = "";
    let archivosReferenciaText = "";

    if (this.folios.length > 0) {
      for (var i = 0; i < this.folios.length; i++) {
        foliosReferenciaText = foliosReferenciaText + ' ' + this.folios[i].libro.nombre + ' ' + ' Folio: ' + this.folios[i].numeroFolio;
      }
    }
    if (this.archivosFolio.length > 0) {
      for (var i = 0; i < this.archivosFolio.length; i++) {
        archivosReferenciaText = archivosReferenciaText + '     ' + this.archivosFolio[i].descripcion;
      }
    }
    if (this.folioForm.controls["respuestaFolio"].value !== "") {
      respuestaFolio = this.folioForm.controls["respuestaFolio"].value;
    }
    this.Folio.idReceptor = this.folioForm.controls["receptor"].value;

    if (fechaRequerida === "" || fechaRequerida === null) {
      fechaRequerida = "No"
    } else {
      fechaRequerida = this.datePipe.transform(fechaRequerida, 'dd-MM-yyyy hh:mm');
    }

    this.usuarioLibroService
      .find(this.Folio.idReceptor)
      .subscribe((respuesta) => {
        this.receptorPdf = respuesta.body;
      });
    var docDefinition = {
      content: [
        {
          image: 'data:image/png;base64,' + imagenBase642,
          style: 'sectionHeader'
        },
        {
          table: {
            headerRows: 0,
            widths: [50, 260, 70, '*'],
            body: [
              [{ text: 'Contrato :', bold: true, fontSize: 8, }, { text: `${this.Folio.libro.contrato.nombre}`, bold: true, fontSize: 8, }, { text: 'Libro :', bold: true, fontSize: 8, }, { text: `${this.Folio.libro.nombre}`, bold: true, fontSize: 8, }],
              [{ text: 'Codigo :', fontSize: 8, }, { text: `${this.Folio.libro.contrato.codigo}`, fontSize: 8, }, { text: 'Codigo :', fontSize: 8, }, { text: `${this.Folio.libro.codigo}`, fontSize: 8, }],
              [{ text: 'Mandante :', fontSize: 8, }, { text: `${this.Folio.libro.contrato.dependenciaMandante.entidad.nombre} | Rut: 18.011.897-7`, fontSize: 8, }, { text: 'Clase Libro :', fontSize: 8, }, { text: `${this.Folio.libro.tipoLibro.descripcion}`, fontSize: 8, }],
              [{ text: '', fontSize: 8, }, { text: `${this.Folio.libro.contrato.dependenciaMandante.nombre}`, fontSize: 8, }, { text: 'Tipo Firma :', fontSize: 8, }, { text: `${this.Folio.libro.tipoFirma.nombre}`, fontSize: 8, }],
              [{ text: 'Contratista : ', fontSize: 8, }, { text: `${this.dependenciaContratista.entidad.nombre} | Rut: 18.011.897-7`, fontSize: 8, }, { text: 'Fecha Apertura :', fontSize: 8, }, { text: `${moment(this.Folio.libro.fechaApertura).format('DD-MM-YYYY hh:mm')}`, fontSize: 8, }],
              [{ text: '', fontSize: 8, }, { text: `${this.dependenciaContratista.nombre}`, fontSize: 8, }, { text: '', fontSize: 8, }, { text: ``, fontSize: 8, }],
            ],
          },
          layout: {
            hLineWidth: function (i, node) {
              return i === 0 || i === node.table.body.length ? 0 : 0;
            },
            vLineWidth: function (i, node) {
              return 0;
            },
            hLineColor: function (i, node) {
              return i === 0 || i === node.table.body.length ? "red" : "grey";
            },
            vLineColor: function (i, node) {
              return i === 0 || i === node.table.widths.length ? "red" : "grey";
            },
          },

        },
        {
          table: {
            headerRows: 0,
            widths: [60, 300],
            body: [
              [{ text: `Folio #${this.correlativoPdf}`, bold: true, fontSize: 8, margin: [0, 20, 0, 0] }, { text: `${moment(this.Folio.fechaFirma).format('DD-MM-YYYY hh:mm')}`, bold: true, fontSize: 8, margin: [0, 20, 0, 0] }],
              [{ text: `Emisor :`, bold: false, fontSize: 8, }, { text: ` ${this.emisorPdf.usuarioDependencia.usuario.firstName}  ${this.emisorPdf.usuarioDependencia.usuario.lastName} | Rut: ${this.emisorPdf.usuarioDependencia.rut}`, bold: false, fontSize: 8 }],
              [{ text: ``, bold: true, fontSize: 8, }, { text: `${this.emisorPdf.cargoFuncion}`, bold: false, fontSize: 8 }],
              [{ text: `Receptor :`, bold: false, fontSize: 8, }, { text: ` ${this.receptorPdf.usuarioDependencia.usuario.firstName} ${this.receptorPdf.usuarioDependencia.usuario.lastName} | Rut: ${this.receptorPdf.usuarioDependencia.rut}`, bold: false, fontSize: 8 }],
              [{ text: ``, bold: true, fontSize: 8, }, { text: `${this.receptorPdf.cargoFuncion}`, bold: false, fontSize: 8 }],
              [{ text: `Tipo de Folio :`, bold: false, fontSize: 8, }, { text: `${this.Folio.tipoFolio.nombre}`, bold: false, fontSize: 8 }],
              [{ text: `Respuesta de :`, bold: false, fontSize: 8, }, { text: `${respuestaFolio}`, bold: false, fontSize: 8 }],
              [{ text: `Referencia de :`, bold: false, fontSize: 8, }, { text: `${foliosReferenciaText}`, bold: false, fontSize: 8 }],
              [{ text: `Fecha Requerida :`, bold: false, fontSize: 8, }, { text: `${fechaRequerida}`, bold: false, fontSize: 8 }],
              [{ text: `Asunto :`, bold: false, fontSize: 8, }, { text: `${this.Folio.asunto}`, bold: false, fontSize: 8 }],
            ]
          },
          layout: {
            hLineWidth: function (i, node) {
              return i === 0 || i === node.table.body.length ? 0 : 0;
            },
            vLineWidth: function (i, node) {
              return 0;
            },
            hLineColor: function (i, node) {
              return i === 0 || i === node.table.body.length ? "red" : "grey";
            },
            vLineColor: function (i, node) {
              return i === 0 || i === node.table.widths.length ? "red" : "grey";
            },
          },
        },
        {
          text: `Anotacion :`,
          bold: true,
          fontSize: 8,
          margin: [0, 20, 0, 0]
        },
        {
          text: anotacion ,
          style: "",
          bold: true,
          fontSize: 8,
          margin: [0, 5, 0, 0]
        },
        {
          text: `${this.archivosFolio.length} Archivos Adjuntos :`,
          bold: true,
          fontSize: 8,
          margin: [0, 20, 0, 0]
        },
        {
          text: `${archivosReferenciaText}`,
          bold: false,
          fontSize: 8,
          margin: [0, 5, 0, 0]
        },
        {
          text: `${usuarioLibroActual}`,
          bold: true,
          fontSize: 8,
          margin: [0, 20, 0, 0]
        },
        {
          text: `${this.usuario.cargoFuncion}`,
          bold: false,
          fontSize: 8,
          margin: [0, 5, 0, 0]
        },
        {
          text: `Fecha Firma : ${moment(this.Folio.fechaFirma).format('DD-MM-YYYY hh:mm')}`,
          bold: false,
          fontSize: 8,
          margin: [0, 5, 0, 0]
        },
        {
          text: `Firma Digital Avanzada`,
          bold: false,
          fontSize: 8,
          margin: [0, 5, 0, 0]
        },
        {
          text: `Cód. Verificación: d5sd4537dasd45675asd456ad-7856asd-745`,
          bold: false,
          fontSize: 8,
          margin: [0, 5, 0, 0]
        },
      ],
      styles: {
        sectionHeader: {
          bold: true,
          decoration: 'underline',
          fontSize: 14,
          margin: [0, 15, 0, 15]
        },
        exampleLayout: {

        }
      },
      images: {

      }
    };
    const pdfDocGenerator = pdfMake.createPdf(docDefinition);
    let url;
    let promise = await new Promise(function (resolve, reject) {
      pdfDocGenerator.getBlob((blob) => {
        url = URL.createObjectURL(blob);
        resolve(url);
      });
    });
    const dialogRef = this.dialog.open(VisorPdfComponent, {
      width: "100%",
      height: "95%",
      data: {
        pdf: url,
        folio: this.Folio,
        usuario: this.usuario,
        pdfArchivoCompleto: pdfDocGenerator,
        previsualisar: true,
        lectura: false,
        listaUsuariosCambioAdmin: this.listaUsuariosCambioAdmin,
        folioReferencias: this.folios
      },
    });
    */
  }
  visualizarPdfOrigen() {
    this.folioService
      .find(this.Folio.idFolioRelacionado)
      .subscribe((folioOrigen) => {
        let pdf = folioOrigen.body.pdfFirmado;
        let contentType = folioOrigen.body.pdfFirmadoContentType;
        let url = "data:" + contentType + ";base64," + pdf;
        let promise = new Promise(function (resolve, reject) {
          fetch(url)
            .then((res) => {
              return res.blob();
            })
            .then((blob) => {
              resolve(URL.createObjectURL(blob));
            });
        });
        promise.then((resultado) => {
          const dialogRef = this.dialog.open(VisorPdfComponent, {
            width: "100%",
            height: "90%",
            data: {
              pdf: resultado,
              folio: this.Folio,
              usuario: null,
              pdfArchivoCompleto: null,
              previsualisar: false,
              lectura: false,
            },
          });
        });
      });
  }
  buscaFolioReferencia() {
    const dialogRef = this.dialog.open(ModalBuscarFolioComponent, {
      width: "100%",
      data: {
        idContrato: this.libro.contrato.id,
        folios: this.folios,
        libro: this.libro,
        folioRelacionado: this.folioRelacionado,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === null || result === "" || result === undefined) {
      } else {
      }
    });
  }

  modalCambioAdministrador() {
    const dialogRef = this.dialog.open(CambioAdministradorComponent, {
      width: "40%",
      data: { libro: this.libro },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === null || result === "" || result === undefined) {
      } else {
        this.listaUsuariosCambioAdmin = result;
        let textoAdminActual =
          "Administrador Actual : " +
          result[0].usuarioDependencia.usuario.firstName +
          " " +
          result[0].usuarioDependencia.usuario.lastName;
        let textoNuevoAdmin =
          "Nuevo Administrador : " +
          result[1].usuarioDependencia.usuario.firstName +
          " " +
          result[1].usuarioDependencia.usuario.lastName;
        let textoCompleto = textoAdminActual + " | " + textoNuevoAdmin;
        this.folioForm.controls["cambioAdmin"].setValue(textoCompleto);
      }
    });
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || "").trim()) {
      this.folios.push({ name: value.trim() });
    }

    // Reset the input value
    if (input) {
      input.value = "";
    }
  }

  remove(folio: any): void {
    const index = this.folios.indexOf(folio);
    if (index >= 0) {
      if (this.folios.length <= 1) {
        this.folios = [];
        this.folioService.removerListaFoliosAgregados(folio);
        this.folioService.clearListaFoliosAgregados();
      } else {
        this.folios.splice(index, 1);
        this.folioService.removerListaFoliosAgregados(folio);
      }
    }
  }
  _handleReaderLoaded(readerEvt) {
    var binaryString = readerEvt.target.result;
    this.base64textString = btoa(binaryString);
  }
  buscaCorrelativoFolio() {
    this.folioService
      .correlativoFolio(this.Folio.libro.id)
      .subscribe((respuesta) => {
        this.folioSiguiente = respuesta.body[0].numero_folio;
      });
  }
  onUploadError(event) { }
  onUploadSuccess(event) {

    let file = new Archivo();
    let archivoEvent = event[1].files.file;
    var documento = archivoEvent.split(",");
    var aux = documento[0].split("data:");
    var tipoDocumento = aux[1].split(";");
    file.archivo = documento[1];
    file.archivoContentType = tipoDocumento[0];
    this.archivosFolio.push(file);
    console.log(event);;
  }
  correlativoFolio(id: any) {
    this.folioService.correlativoFolio(id).subscribe((respuesta) => {
      this.correlativoPdf = respuesta.body[0].numero_folio;
    });
  }
  cambiaReceptor(receptor) {
    this.receptorPdf = receptor;
  }
  achivosPorFolio(idFolio) {
    this.archivoService.AchivosPorFolio(idFolio).subscribe((folio) => {
      if (folio.body.length > 0) {
        this.archivosFolio = folio.body;
        this.editarArchivosFolios = true;
        this.onUploadInit(1, this.archivosFolio);
        this.getFilesFromLibrary();
      } else {
        this.archivosFolio = [];
        this.editarArchivosFolios = false;
      }
    });
  }
  async readFiles(listName: string, options?: any) {
    let res;
    res = this.archivosFolio;
    return res;
  }
  async getFilesFromLibrary() {
    const results = await this.readFiles("archivo_folios");
    this.archivosFolio = results;
  }
  async onFileChange(event) {
    this.subiendoArchivos = true ;
    let files = [];
    files = event.target.files;
    for (var i = 0; i < files.length; i++) {
      let archivo = new Archivo();
      archivo.nombre = files[i].name;
      archivo.descripcion = files[i].name;
      archivo.size = formatBytes(files[i].size);
      archivo.archivoContentType = "";
      archivo.archivo = "";
      this.archivosFolio = [... this.archivosFolio, archivo];
      for (var x = 0; x < event.target.files.length; x++) {
        this.archivosFolioGCP = [...this.archivosFolioGCP, event.target.files[x]];
        
      }
      this.subirArchivosNuevos = true;
      await this.SubirArchivo2(archivo).then(()=>{
        archivo.value = 0;
        if(files.length === (i + 1)){
          console.log('entro');
          this.subiendoArchivos = false;
        }
      })
     
    }
  }
  toBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }
  async toBase64Handler(file) {
    const filePathsPromises = [];
    let files2 = [];
    files2 = file;
    filePathsPromises.push(this.toBase64(files2));
    const filePaths = await Promise.all(filePathsPromises);
    const mappedFiles = filePaths.map((base64File) => ({
      selectedFile: base64File,
    }));
    return mappedFiles;
  }
  eliminarArchivo(file) {
    console.log(file);
    if (file.id === undefined) {
      let index = this.archivosFolio.indexOf(file);
      this.archivosFolio.splice(index, 1);
      this.archivosFolio.forEach(element => {
        if (element.status === false) {
          this.subirArchivosNuevos = true;
        } else {
          this.subirArchivosNuevos = false;
        }
      });
    } else {
      Swal.fire({
        title: "Esta Seguro ?",
        text: "Los cambios no podran ser revertidos!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Si, Eliminar Archivo!",
        cancelButtonText: "No, Mantener Archivo",
      }).then((result) => {
        if (result.value) {
          this.archivoService.deleteGCP({ name: file.nombre }).subscribe(
            respuesta => {
            }
          );
          if(this.archivosFolio.length === 1) {
            this.Folio.poseeArchivos = false;
            this.folioService.update(this.Folio).subscribe();
          }
          let index = this.archivosFolio.indexOf(file);
          this.archivosFolio.splice(index, 1);
          this.archivoService.delete(file.id).subscribe(
            (response) => {
              Swal.fire(
                "Eliminado!",
                "Archivo Eliminado Correctamente.",
                "success"
              );
              this.archivosFolio.forEach(element => {
                if (element.status === false) {
                  this.subirArchivosNuevos = true;
                } else {
                  this.subirArchivosNuevos = false;
                }
              });
            },
            (error) => {
              Swal.fire("Error!", "El archivo no pudo ser borrado.", "warning");
            }

          );
          /*
          this.archivoService.deleteGCP('path  1 ').subscribe(
            archivo=>{
              console.log(archivo);
            }
          );*/
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire("Cancelado", "Cancelado", "error");
        }
      });
    }
  }


  async SubirArchivo(file) {
    let formData = new FormData();
    //let archivoGCP = this.archivosFolioGCP.filter(archivo => archivo.name === file.nombre);
    console.log(file);
    for (var i = 0; i < this.archivosFolioGCP.length; i++) {
      if (this.archivosFolioGCP[i].name == file.nombre) {
        console.log('ingresa');
        formData.append("file", this.archivosFolioGCP[i], this.archivosFolioGCP[i].name);
        this.archivoService.createGCP(formData).pipe().subscribe(
          event => {
            if (event['loaded'] && event['total']) {
              file.value = Math.round(event['loaded'] / event['total'] * 100);
            }
            if (event['body']) {
              console.log(event['body']);
              file.value = 0;
              Swal.fire(
                "Subidos!",
                "Archivos Subidos Correctamente.",
                "success"
              );
              file.folio = this.Folio;
              file.urlArchivo = event['body'];
              file.status = true;
              this.subirArchivosNuevos = false;
              if (file.id === undefined || file.id === null) {
                this.archivoService.create(file).subscribe(
                  archivos => {
                    file.id = archivos.body.id;
                    file.status = true;
                    file.value = 0;
                  }
                );
              }

              /*
              let index = this.archivosFolio.indexOf(element);
              this.archivosFolio[index].id = respuesta.body.id;
              console.log(this.archivosFolio);
              */

            }

          },
          (existe) => { }
        );
      } else {

      }
    }




  }


  async SubirArchivo2(file) {
    this.Folio.poseeArchivos = true;
    this.folioService.update(this.Folio).subscribe();
    for (var i = 0; i < this.archivosFolioGCP.length; i++) {
      
      let formData = new FormData();
      if (this.archivosFolioGCP[i].name == file.nombre) {
        formData.append("file", this.archivosFolioGCP[i], this.archivosFolioGCP[i].name);
        await new Promise((resolve) => {
          let subscripcion = this.archivoService.createGCP(formData).pipe().subscribe(
            event => {
              if (event['loaded'] && event['total']) {
                file.value = Math.round(event['loaded'] / event['total'] * 100);
              }
              if (event['body']) {
                file.folio = this.Folio;
                file.urlArchivo = event['body'];
                file.status = true;
                this.subirArchivosNuevos = false;
                if (file.id === undefined || file.id === null) {
                 
                  this.archivoService.create(file).subscribe(
                    archivos => {
                      file.id = archivos.body.id;
                      file.status = true;
                      subscripcion.unsubscribe();
                    }
                  );
                }
                resolve(i);
              }
            },
          );
        });
      }
    }
  }
  dowloadGCP(file) {
    console.log(file);
    let path = 'https://www.googleapis.com/storage/v1/b/contenedor-archivos-clientes-lo-digital/o/' + file.nombre + '?alt=media';
    location.href = path;
  }
  async uploadAllFile() {
    if (this.archivosFolioGCP.length > 0) {
      for (var i = 0; i < this.archivosFolioGCP.length; i++) {
        let formData = new FormData();
        formData.append("file", this.archivosFolioGCP[i], this.archivosFolioGCP[i].name);
        for (var x = 0; x < this.archivosFolio.length; x++) {
          await this.SubirArchivo2(this.archivosFolio[x]).then(
            res => {
            }
          );
        }
      }
    }
  }
  guardarGCPFile(element) {
    this.archivoService.create(element).subscribe(
      archivos => {
        let index = this.archivosFolio.indexOf(element);
        this.archivosFolio[index].id = archivos.body.id;
        this.archivosFolio[index].status = true;
        this.Folio.poseeArchivos =true;
        this.folioService.update(this.Folio).subscribe();
      }
    );
  }

  async GCPFilesSaves(formData, element) {
    await new Promise((resolve) => {
      this.archivoService.createGCP(formData).pipe().subscribe(
        event => {
          if (event['loaded'] && event['total']) {
            element.value = Math.round(event['loaded'] / event['total'] * 100);
          }
          if (event['body']) {
            console.log(element.value);
            element.folio = this.Folio;
            element.urlArchivo = event['body'];
            element.status = true;
            element.value = 0;
            this.subirArchivosNuevos = false;
            if (element.id === undefined || element.id === null) {
              this.guardarGCPFile(element);
              resolve("ok");
            }
          }
        },
        (existe) => { }
      );
    }).then((value) => {
      return value;
    })
  }
}



function getBase64Image(img) {
  var canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);
  var dataURL = canvas.toDataURL("image/png");
  return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}
function stripHtml(html) {
  console.log(html);
  // Create a new div element
  var temporalDivElement = document.createElement("div");
  // Set the HTML content with the providen
  temporalDivElement.innerHTML = html;
  console.log(temporalDivElement.innerHTML)
  // Retrieve the text property of the element (cross-browser support)*/
  return temporalDivElement.textContent || temporalDivElement.innerText || "";
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
function formatBytes(bytes) {
  if (bytes < 1024) return bytes + " Bytes";
  else if (bytes < 1048576) return (bytes / 1024).toFixed(3) + " KB";
  else if (bytes < 1073741824) return (bytes / 1048576).toFixed(3) + " MB";
  else return (bytes / 1073741824).toFixed(3) + " GB";
};

function htmlToPdfBorrador(anotacion,object){
  let logo1 = document.createElement("img");
  logo1.src = "/assets/img/logo42_.png";
  let logo2 = document.createElement("img");
  logo2.src = "/assets/img/letra120x34_.png";
  let img1 = document.createElement("img");
  img1.src = "/assets/img/logo.jpg";
 
  
  let html= `
  <!DOCTYPE html>
  <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
      <title>Folio Borrador</title>
      <style>
        html {                              
          -webkit-text-size-adjust: 100%;
          -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        }            
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"; 
          margin-top: 35px;
          margin-bottom: 30px;
          margin-left: 30px;
          margin-right: 30px;
          font-size: 10px;
          font-weight: 400;
          line-height: 10px;
          color: #212529;
          text-align: left;
          background-color: #fff;
          width: auto;
        }
            
        hr {
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
          border: 0;
          border-top: 1px solid rgba(0, 0, 0, 0.1);
        }

        hr.hr2 {
          margin-top: 1px;
          margin-bottom: 1px;
          border: 0;
          border-top: 3px solid rgba(0, 0, 0, 0.1);            
        }
            
        .badge {
          display: inline-block;
          padding: 0.25em 0.4em;
          font-size: 75%;
          font-weight: 700;
          line-height: 1;
          text-align: center;
          white-space: nowrap;
          vertical-align: baseline;
          border-radius: 0.25rem;
          background-color: #4285f4;
          color: #ffffff;
        }         
            
      </style>
    </head>
    <body>
      <div style="padding-bottom: 12px;">
        <table>
          <tr>
            <td style="min-width: 600px; padding-right: 10px;font-size: 16;">
              <img src="${logo1.src}" />
              <img src="${logo2.src}"/>                        
            </td>
            <td style="min-width: 100px; padding-top: 10px;">
              <div style="font-size: 18px;">
                <strong style="color: dimgrey;">Folio Nº1000</strong>
                <hr style="margin-top: 10px;margin-bottom: -3px;"></hr>
              </div>                        
              <div style="font-size: 10px;padding-top: 6px;color: dimgrey;">Fecha: 12/04/2020 13:45</div>                        
            </td>                
          </tr>
        </table>            
      </div>        
      <hr class="hr2">        
      <table>
        <tr>
          <td style="min-width: 530px; padding-right: 10px;">
            <table>
              <tr>
                <td style="min-width: 80px;">
                  <strong>Contrato:</strong>                        
                </td>
                <td>
                  <strong>${object.folio.libro.contrato.nombre}</strong>
                </td>               
              </tr>
              <tr>
                <td>Código:</td>
                <td>${object.folio.libro.contrato.codigo}</td>               
              </tr>
              <tr>
                <td>Mandante:</td>
                <td>
                  ${object.folio.libro.contrato.dependenciaMandante.entidad.nombre} | &nbsp;RUT: 78.254.365-6                         
                </td>                
              </tr>
                <tr>
                <td></td>
                <td>
                  ${object.folio.libro.contrato.dependenciaMandante.direccion}
                </td>                
              </tr>
              <tr>
                <td>Contratista:</td>
                <td>
                  ${object.contratista.entidad.nombre} |  &nbsp;RUT: 76.564.698-9
                </td>                
              </tr>
              <tr>
                <td></td>
                <td>
                  ${object.contratista.nombre}
                </td>                
              </tr>
            </table>                    
          </td>
          <td style="width: 250px;">
            <table>
              <tr>
                <td style="width: 80px;">
                  <strong>Libro:</strong>
                </td>
                <td>
                  <strong>${object.folio.libro.nombre}</strong>
                </td>
              </tr>
              <tr>
                <td>Código:</td>
                <td>${object.folio.libro.codigo}</td>
              </tr>
              <tr>
                <td>Clase Libro:</td>
                <td>${object.folio.libro.tipoLibro.descripcion}</td>
              </tr>
              <tr>
                <td>Tipo Firma:</td>
                <td>${object.folio.libro.tipoFirma.nombre}</td>
              </tr>
              <tr>
                <td>Fecha Apertura:</td>
                <td>${moment(object.folio.libro.fechaApertura).format('DD-MM-YYYY hh:mm')}</td>
              </tr>
              <tr>
                <td>Fecha Cierre:</td>
                <td>${object.folio.libro.fechaCierre}</td>
              </tr>
            </table>
          </td>                
        </tr>
      </table>
      <hr>
      <div>
        <table>          
          <tr>
            <td style="width: 80px;">Emisor:</td>
            <td>
              ${object.emisor.usuarioDependencia.usuario.firstName}  ${object.emisor.usuarioDependencia.usuario.lastName} | Rut: ${object.emisor.usuarioDependencia.rut}
            </td>
          </tr>
          <tr>
            <td></td>
            <td>${object.emisor.cargoFuncion}</td>
          </tr>
          <tr>
            <td>Receptor:</td>
            <td>
              ${object.receptor.usuarioDependencia.usuario.firstName}  ${object.receptor.usuarioDependencia.usuario.lastName} | Rut: ${object.receptor.usuarioDependencia.rut}
            </td>
          </tr>
          <tr>
            <td></td>
            <td>${object.receptor.cargoFuncion}</td>
          </tr>
          <tr>
            <td>Tipo de Folio:</td>
            <td>${object.folio.tipoFolio.nombre}</td>
          </tr>
          <tr>
            <td>Respuesta de:</td>
            <td>Libro Maestro | Folio Nº23</td>                
          </tr>
          <tr>
            <td>Referencia de:</td>
            <td>                     
              <li class="list-inline-item ">
              <a>Libro Maestro  | Folio Nº22&nbsp;;</a>
              </li>                    
            </td>
          </tr>
          <tr>
            <td>Fecha Requerida:</td>
            <td>
              <span class="badge">n/a</span>
              <span class="badge">
                25-12-2020 13:00
              </span>
            </td>
          </tr>
          <tr>
            <td>Asunto:</td>
            <td>${object.folio.asunto}</td>
          </tr>
        </table>
              
      </div>
      <hr>
      <div style="font-weight: bold;margin-bottom: 10px;">Anotación:</div>
      <div style="line-height: 1.15;">
        ${anotacion}
      </div>
      <hr>
      <div>
        <strong>Archivos Adjuntos:</strong>
        <ul style="line-height: 17px;">
          <li>Lorem ipsum.jpg | 3,56 MB</li>
          <li>Phasellus iaculis.doc | 12,598 MB</li>
          <li>Nulla volutpat.xls | 6,542 KB</li>
        </ul>
      </div>
      <hr>
      <table>
        <tr>
          <td>
            <img style="max-height: 75px;" src="${img1.src}" />
          </td>
          <td style="padding-left: 5px;">
            <strong>${object.usuarioLibro}</strong>
            <br/>RUT: 13.224.233-K
            <br/>${object.cargoUsuarioLibro}
            <br/>${moment(object.folio.fechaFirma).format('DD-MM-YYYY hh:mm')} 
            <br/>${object.folio.libro.tipoFirma.nombre}
            <br/>Cód. Verificación: d5sd4537dasd45675asd456ad-7856asd-745
          </td>
        </tr>
      </table>               
      <hr class="mt-3"></hr>
      <div style="text-align: end;font-size: 10px;">
        Para verificar la validez del folio dirigirse a <a href="">www.lodigital.cl</a>
      </div>
    </body>
  </html>
  `;
  return html;
}