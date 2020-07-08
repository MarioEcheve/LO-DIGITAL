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
      requiereRespuesta: [null],
      tipoFolio: ["", Validators.required],
      anotacion: [],
      numeroFolio: [],
      emisor: [],
      usuarioPerfilLibro: [],
      usuarioNombre: [],
      perfilUsuario: [],
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
      let usuarioActual = JSON.parse(localStorage.getItem("user"));
      this.obtenerPerfilLibroUsuario(this.Folio.libro.id, usuarioActual.id);
      this.folioForm.controls["asunto"].setValue(respuesta.body.asunto);
      this.folioForm.controls["anotacion"].setValue(respuesta.body.anotacion);
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
    } else {
      this.muestraFechaRequerida = true;
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
    var imagenLogo1 = getBase64Image(document.getElementById("imagenLogo1"));
    var imagenLogo2 = getBase64Image(document.getElementById("imagenLogo2"));
    console.log(imagenLogo1);
    var docDefinition = {
      content: [
        {
          alignment: "justify",
          columns: [
            {
              image: "data:image/png;base64," + imagenLogo1,
              width: 40,
              absolutePosition: { x: 50, y: 50 },
            },

            {
              image: "data:image/png;base64," + imagenLogo2,
              width: 100,
              absolutePosition: { x: 90, y: 57 },
            },
          ],
          columnGap: 5,
        },
      ],
    };
    const pdfDocGenerator = pdfMake.createPdf(docDefinition);
    let url;
    let promise = new Promise(function (resolve, reject) {
      pdfDocGenerator.getBlob((blob) => {
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
        },
      });
    });
  }
  _handleReaderLoaded(readerEvt) {
    var binaryString = readerEvt.target.result;
    this.base64textString = btoa(binaryString);
    console.log(btoa(binaryString));
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
