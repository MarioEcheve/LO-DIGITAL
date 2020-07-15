import { Component, OnInit } from "@angular/core";
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
import { Folio } from "../../TO/folio.model";
import { UsuarioLibroService } from "../../services/usuario-libro.service";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { VisorPdfComponent } from "../../shared/visor-pdf/visor-pdf/visor-pdf.component";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
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
  dependenciaContratista = new Dependencia();
  tipoFolio: ITipoFolio[];
  tipoFolioSeleccionado: any = "";
  muestraFechaRequerida = false;
  base64textString: string = "";
  usuario;
  muestraImagenes = false;
  folioSiguiente;
  // IMPLEMENTACION CONFIG ANGULAR-EDITOR
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: "auto",
    minHeight: "300px",
    maxHeight: "auto",
    width: "auto",
    minWidth: "0",
    translate: "yes",
    enableToolbar: true,
    showToolbar: true,
    placeholder: "Enter text here...",
    defaultParagraphSeparator: "",
    defaultFontName: "",
    defaultFontSize: "",
    fonts: [
      { class: "arial", name: "Arial" },
      { class: "times-new-roman", name: "Times New Roman" },
      { class: "calibri", name: "Calibri" },
      { class: "comic-sans-ms", name: "Comic Sans MS" },
    ],
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
    uploadUrl: "v1/image",
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: "top",
    toolbarHiddenButtons: [["bold", "italic"], ["fontSize"]],
  };
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
    private usuarioLibroService: UsuarioLibroService
  ) {}

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
      anotacion: [],
      numeroFolio: [],
      emisor: [],
      usuarioPerfilLibro: [],
      usuarioNombre: [],
      perfilUsuario: [],
      respuestaFolio : [],
      fechaRequeridaDatepicker : []
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
    //this.buscarFolioPorLibro(idLibro);
  }
  buscarFolio(id) {
    this.folioService.find(id).subscribe((respuesta) => {
      this.Folio = respuesta.body;
      this.buscaCorrelativoFolio();
      let usuarioActual = JSON.parse(localStorage.getItem("user"));
      this.obtenerPerfilLibroUsuario(this.Folio.libro.id, usuarioActual.id);
      this.folioForm.controls["asunto"].setValue(respuesta.body.asunto);
      this.folioForm.controls["anotacion"].setValue(respuesta.body.anotacion);
      this.folioForm.controls["requiereRespuesta"].setValue(respuesta.body.requiereRespuesta);
      if(this.folioForm.controls["requiereRespuesta"].value === false){
        this.muestraFechaRequerida = false;
        this.folioService.find(respuesta.body.idFolioRelacionado).subscribe(
          folioRelacionado => {
            this.folioForm.controls["respuestaFolio"].setValue(
              "Libro :" +folioRelacionado.body.libro.nombre+" | " +
              "Folio : " + folioRelacionado.body.numeroFolio + " | " +
              "Asunto :" + folioRelacionado.body.asunto + " | " + 
              "Fecha Firma :" + this.datePipe.transform( folioRelacionado.body.fechaFirma, 'dd-MM-yyyy')
              )
          }
        );
      }else{
        //this.folioForm.controls["fechaRequeridaDatepicker"].setValue(this.datePipe.transform(respuesta.body.fechaRequerida,"dd-MM-yyyy"));
        this.muestraFechaRequerida = true;
        //console.log(this.folioForm.controls["fechaRequeridaDatepicker"].value);
      }
      let tipo = this.folioForm.controls["tipoFolio"].setValue(
        respuesta.body.tipoFolio
      );
      if (
        respuesta.body.tipoFolio.nombre.toLocaleLowerCase() === "apertura libro"
      ) {
        let tipo = this.tipoFolio.filter((tipo) => {
          return tipo.nombre.toLowerCase() === "apertura libro";
        });
        this.tipoFolio = tipo;
      } else {
        let tipo = this.tipoFolio.filter((tipo) => {
          return tipo.nombre.toLowerCase() !== "apertura libro";
        });
        this.tipoFolio = tipo;
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
          this.folioForm.controls["emisor"].setValue(
            respuesta.body.usuarioDependencia.usuario.firstName +
              " " +
              respuesta.body.usuarioDependencia.usuario.lastName
          );
          this.folioForm.controls["usuarioPerfilLibro"].setValue(
            respuesta.body.perfilUsuarioLibro.nombre
          );
        });
    });
    // desabilitamos los inputs del form
    this.folioForm.controls["fechaModificacion"].disable();
    this.folioForm.controls["fechaCreacion"].disable();
    this.folioForm.controls["emisor"].disable();
    this.folioForm.controls["usuarioPerfilLibro"].disable();
    this.folioForm.controls["respuestaFolio"].disable();
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
    this.Folio.estadoFolio = false;
    this.Folio.fechaRequerida = moment(this.folioForm.controls["fechaRequeridaDatepicker"].value);
    if (this.tipoFolioSeleccionado !== "") {
      this.Folio.tipoFolio = this.tipoFolioSeleccionado;
    }
    this.folioService.update(this.Folio).subscribe(
      (respuesta) => {
        this.buscarFolio(respuesta.body.id);
        this.showNotificationSuccess("top", "right");
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
        this.Folio.estadoFolio = true;
        this.Folio.fechaRequerida = moment(this.folioForm.controls["fechaRequeridaDatepicker"].value);
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
      }
    });
  }
  ocultaFechaRequerida() {
    if (this.folioForm.controls["requiereRespuesta"].value === true) {
      this.muestraFechaRequerida = false;
      this.Folio.requiereRespuesta = false;
    } else {
      this.muestraFechaRequerida = true;
      this.Folio.requiereRespuesta = true;
    }
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
  onUploadInit(event) {}

  obtenerPerfilLibroUsuario(idLibro, idUsuario) {
    this.usuarioLibroService
      .buscarlibroPorContrato(idLibro, idUsuario)
      .subscribe((respuesta) => {
        console.log(respuesta.body);
        this.usuario = respuesta.body[0];
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
        this.folioService.delete(this.Folio.id).subscribe((respuesta) => {
          Swal.fire("Eliminado!", "Folio Eliminado Correctamente.", "success");
          // For more information about handling dismissals please visit
          // https://sweetalert2.github.io/#handling-dismissals
          this.router.navigate([
            "/folio/folio/",
            this.libro.contrato.id,
            this.libro.id,
          ]);
        });
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
  }
  previsualizar() {
    let imagenLogo1 = getBase64Image(document.getElementById("imagenLogo1"));
    let imagenLogo2 = getBase64Image(document.getElementById("imagenLogo2"));
    let anotacion = stripHtml(this.folioForm.controls["anotacion"].value);

    console.log(anotacion);
    //console.log(imagenLogo1);
    var docDefinition = {
      content: [
        {
          absolutePosition: { x: 50, y: 50 },
          style: "tableExample",
          table: {
            widths: ["60%", "0%", "40%"],
            body: [
              [
                {
                  image: "bee",
                  width: 60,
                  height: 50,
                },
                "",
                "        ",
              ],
              [
                {
                  stack: [
                    {
                      text: "Contrato: " + this.libro.contrato.nombre,
                      italics: true,
                    },
                    {
                      text: "Codigo: " + this.libro.contrato.codigo,
                      italics: true,
                    },
                    {
                      text: [
                        { text: "Mandante : ", italics: true },
                        {
                          text: this.libro.contrato.dependenciaMandante.entidad
                            .nombre,
                          italics: true,
                        },
                      ],
                    },
                    {
                      text: [
                        { text: "Contratista : ", italics: true },
                        {
                          text: this.dependenciaContratista.entidad.nombre,
                          italics: true,
                        },
                      ],
                    },
                  ],
                },
                /* a nested table will appear here as soon as I fix a bug */
                [""],
                {
                  stack: [
                    {
                      text: "Libro: " + this.libro.nombre,
                      italics: true,
                    },
                    { text: "Codigo: " + this.libro.codigo, italics: true },
                    {
                      text: "Clase Libro: " + this.libro.tipoLibro.descripcion,
                      italics: true,
                    },
                    {
                      text: [
                        { text: "Tipo Firma: ", italics: true },
                        { text: this.libro.tipoFirma.nombre, italics: true },
                      ],
                    },
                    {
                      text: [
                        { text: "Fecha Apertura: ", italics: true },
                        {
                          text: this.datePipe.transform(
                            this.libro.fechaApertura,
                            "dd-MM-yyyy hh:mm"
                          ),
                          italics: true,
                        },
                      ],
                    },
                    {
                      text: [
                        { text: "Fecha cierre: ", italics: true },
                        {
                          text: this.datePipe.transform(
                            this.libro.fechaCierre,
                            "dd-MM-yyyy hh:mm"
                          ),
                          italics: true,
                        },
                      ],
                    },
                  ],
                },
              ],
            ],
          },
          layout: {
            hLineWidth: function (i, node) {
              return i === 0 || i === node.table.body.length ? 0 : 0.2;
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
          absolutePosition: { x: 50, y: 200 },
          style: "tableExample",
          table: {
            widths: ["60%", "0%", "40%"],
            body: [
              ["", "", "        "],
              [
                {
                  stack: [
                    {
                      text:
                        "Folio" +
                        "#" +
                        this.folioSiguiente +
                        ": " +
                        this.datePipe.transform(Date.now(), "dd-MM-yyyy hh:mm"),
                      italics: true,
                    },
                    {
                      text:
                        "Emisor: " + this.folioForm.controls["emisor"].value,
                      italics: true,
                    },
                    {
                      text: [
                        { text: "Tipo de Folio : ", italics: true },
                        {
                          text: this.folioForm.controls["tipoFolio"].value,
                          italics: true,
                        },
                      ],
                    },
                    {
                      text: [
                        { text: "Respuesta de: ", italics: true },
                        { text: "n/a  ", italics: true },
                      ],
                    },
                    {
                      text: [
                        { text: "Referencia de: ", italics: true },
                        { text: "", italics: true },
                      ],
                    },
                    {
                      text: [
                        { text: "Fecha requerida: ", italics: true },
                        { text: "", italics: true },
                      ],
                    },
                    {
                      text: [
                        { text: "Asunto: ", italics: true },
                        {
                          text: this.folioForm.controls["asunto"].value,
                          italics: true,
                        },
                      ],
                    },
                  ],
                },
                /* a nested table will appear here as soon as I fix a bug */
                [""],
                {
                  /*
                  stack: [
                    {
                      text: "Libro: " + "Libro Axiliar",
                      italics: true,
                    },
                    { text: "Clase Libro: " + "Axiliar", italics: true },
                    {
                      text: [
                        { text: "Tipo Firma: ", italics: true },
                        { text: "Digital Simple  ", italics: true },
                      ],
                    },
                    {
                      text: [
                        { text: "Fecha Apertura: ", italics: true },
                        { text: "08-07-2020 11:59", italics: true },
                      ],
                    },
                    {
                      text: [
                        { text: "Fecha cierre: ", italics: true },
                        { text: "", italics: true },
                      ],
                    },
                  ],
                  */
                },
              ],
            ],
          },
          layout: {
            hLineWidth: function (i, node) {
              return i === 0 || i === node.table.body.length ? 0 : 0.2;
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
          absolutePosition: { x: 50, y: 320 },
          style: "tableExample",
          table: {
            widths: ["60%", "0%", "40%"],
            body: [
              ["", "", "        "],
              [
                {
                  stack: [
                    {
                      text: "2 " + "Archivos Adjuntos",
                      italics: true,
                    },
                    { text: "Archivo 1  " + "Archivo 2", italics: true },
                  ],
                },
                /* a nested table will appear here as soon as I fix a bug */
                [""],
                {
                  /*
                  stack: [
                    {
                      text: "Libro: " + "Libro Axiliar",
                      italics: true,
                    },
                    { text: "Clase Libro: " + "Axiliar", italics: true },
                    {
                      text: [
                        { text: "Tipo Firma: ", italics: true },
                        { text: "Digital Simple  ", italics: true },
                      ],
                    },
                    {
                      text: [
                        { text: "Fecha Apertura: ", italics: true },
                        { text: "08-07-2020 11:59", italics: true },
                      ],
                    },
                    {
                      text: [
                        { text: "Fecha cierre: ", italics: true },
                        { text: "", italics: true },
                      ],
                    },
                  ],
                  */
                },
              ],
            ],
          },
          layout: {
            hLineWidth: function (i, node) {
              return i === 0 || i === node.table.body.length ? 0 : 0.01;
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
          absolutePosition: { x: 50, y: 370 },
          style: "tableExample",
          table: {
            widths: ["90%", "0%", "0%"],
            body: [
              ["", "", "        "],
              [
                {
                  stack: [
                    {
                      text: "Fernando vilchez",
                      italics: true,
                    },
                    { text: "Administrador de contrato", italics: true },
                    {
                      text: "Fecha Firma:" + " 09-07-2020 15:46",
                      italics: true,
                    },
                    { text: "Firma Digital Avanzada", italics: true },
                    {
                      text:
                        "Cód. Verificación: d5sd4537dasd45675asd456ad-7856asd-745",
                      italics: true,
                    },
                  ],
                },
                /* a nested table will appear here as soon as I fix a bug */
                [""],
                {
                  /*
                  stack: [
                    {
                      text: "Libro: " + "Libro Axiliar",
                      italics: true,
                    },
                    { text: "Clase Libro: " + "Axiliar", italics: true },
                    {
                      text: [
                        { text: "Tipo Firma: ", italics: true },
                        { text: "Digital Simple  ", italics: true },
                      ],
                    },
                    {
                      text: [
                        { text: "Fecha Apertura: ", italics: true },
                        { text: "08-07-2020 11:59", italics: true },
                      ],
                    },
                    {
                      text: [
                        { text: "Fecha cierre: ", italics: true },
                        { text: "", italics: true },
                      ],
                    },
                  ],
                  */
                },
              ],
            ],
          },
          layout: {
            hLineWidth: function (i, node) {
              return i === 0 || i === node.table.body.length ? 0 : 0.01;
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
          absolutePosition: { x: 50, y: 460 },
          style: "tableExample",
          table: {
            widths: ["100%", "0%", "0%"],
            body: [
              ["", "", "        "],
              [
                {
                  stack: [
                    {
                      text: "Anotacion",
                      italics: true,
                    },
                    {
                      text: anotacion,
                      italics: true,
                    },
                  ],
                },
                /* a nested table will appear here as soon as I fix a bug */
                [""],
                {
                  /*
                  stack: [
                    {
                      text: "Libro: " + "Libro Axiliar",
                      italics: true,
                    },
                    { text: "Clase Libro: " + "Axiliar", italics: true },
                    {
                      text: [
                        { text: "Tipo Firma: ", italics: true },
                        { text: "Digital Simple  ", italics: true },
                      ],
                    },
                    {
                      text: [
                        { text: "Fecha Apertura: ", italics: true },
                        { text: "08-07-2020 11:59", italics: true },
                      ],
                    },
                    {
                      text: [
                        { text: "Fecha cierre: ", italics: true },
                        { text: "", italics: true },
                      ],
                    },
                  ],
                  */
                },
              ],
            ],
          },
          layout: {
            hLineWidth: function (i, node) {
              return i === 0 || i === node.table.body.length ? 0 : 0.01;
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
          text: "",
          pageBreak: "after",
        },
      ],
      images: {
        bee: "data:image/png;base64," + imagenLogo1,
        logo2: "data:image/png;base64," + imagenLogo2,
      },
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10],
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5],
        },
        tableExample: {
          margin: [0, 5, 0, 15],
          width: 500,
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: "black",
        },
      },
    };
    const pdfDocGenerator = pdfMake.createPdf(docDefinition);
    let url;
    let promise = new Promise(function (resolve, reject) {
      pdfDocGenerator.getBlob((blob) => {
        console.log(blob);
        url = URL.createObjectURL(blob);
        resolve(url);
      });
    });
    promise.then((resultado) => {
      const dialogRef = this.dialog.open(VisorPdfComponent, {
        width: "100%",
        height: "90%",
        data: {
          pdf: resultado,
          folio: this.Folio,
          usuario: this.usuario,
          pdfArchivoCompleto: pdfDocGenerator,
          previsualisar : true
        },
      });
    });
  }
  visualizarPdfOrigen(){
    this.folioService.find(this.Folio.idFolioRelacionado).subscribe(
      folioOrigen => {
        let pdf = folioOrigen.body.pdfFirmado;
        let contentType = folioOrigen.body.pdfFirmadoContentType;
        let url = "data:"+contentType+";base64,"+pdf;
        let valor ;
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
              usuario: null,
              pdfArchivoCompleto: null,
              previsualisar : false
            },
          });
        });
      }
    );
  }
  

  _handleReaderLoaded(readerEvt) {
    var binaryString = readerEvt.target.result;
    this.base64textString = btoa(binaryString);
    console.log(btoa(binaryString));
  }
  buscaCorrelativoFolio() {
    this.folioService
      .correlativoFolio(this.Folio.libro.id)
      .subscribe((respuesta) => {
        this.folioSiguiente = respuesta.body[0].numero_folio;
      });
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
  // Create a new div element
  var temporalDivElement = document.createElement("div");
  // Set the HTML content with the providen
  temporalDivElement.innerHTML = html;
  // Retrieve the text property of the element (cross-browser support)
  return temporalDivElement.textContent || temporalDivElement.innerText || "";
}
