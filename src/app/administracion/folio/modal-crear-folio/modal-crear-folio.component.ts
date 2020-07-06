import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Libro } from "../../TO/libro.model";
import { TipoFolioService } from "../../services/tipo-folio.service";
import { TipoFolio } from "../../TO/tipo-folio.model";
import { FormGroup, FormBuilder } from "@angular/forms";
import { FolioService } from "../../services/folio.service";
import { Folio } from "../../TO/folio.model";
import * as moment from "moment";
import { Router } from "@angular/router";
import { UsuarioLibroService } from "../../services/usuario-libro.service";
declare var $: any;
@Component({
  selector: "app-modal-crear-folio",
  templateUrl: "./modal-crear-folio.component.html",
  styleUrls: ["./modal-crear-folio.component.css"],
})
export class ModalCrearFolioComponent implements OnInit {
  libros: Libro[] = [];
  tipoFolio: TipoFolio[] = [];
  libroSeleccionado: Libro;
  usuario;
  // definicion de forms
  crearFolioFormGroup: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ModalCrearFolioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private tipoFolioService: TipoFolioService,
    private fb: FormBuilder,
    private folioService: FolioService,
    private router: Router,
    private usuarioLibroService: UsuarioLibroService
  ) {}

  ngOnInit(): void {
    this.inicializarForm();
    this.libros = this.data.libros;
    this.libroSeleccionado = this.data.libroSeleccionado;
    this.obtenerTipoFolio();
    this.asignarValorForm();
    // metodo para saber si un libro posee folios
    this.buscaFolios(this.libroSeleccionado);
    let usuarioActual = JSON.parse(localStorage.getItem("user"));
    this.obtenerPerfilLibroUsuario(this.libroSeleccionado.id, usuarioActual.id);
  }
  obtenerTipoFolio() {
    this.tipoFolioService.query().subscribe((respuesta) => {
      this.tipoFolio = respuesta.body;
    });
  }
  inicializarForm() {
    this.crearFolioFormGroup = this.fb.group({
      libro: [],
      asunto: [],
      tipoFolio: [],
    });
  }
  asignarValorForm() {
    console.log(this.libroSeleccionado);
    this.crearFolioFormGroup.patchValue({
      libro: this.libroSeleccionado.nombre,
    });
  }
  guardarFolio() {
    let folio = new Folio();

    folio.asunto = this.crearFolioFormGroup.controls["asunto"].value;
    folio.tipoFolio = this.crearFolioFormGroup.controls["tipoFolio"].value;
    folio.idUsuarioCreador = this.usuario.id;
    folio.libro = this.libroSeleccionado;
    folio.fechaCreacion = moment(Date.now());
    console.log(folio);
    this.folioService.create(folio).subscribe(
      (respuesta) => {
        this.dialogRef.close();
        this.showNotificationSuccess("top", "right");
        this.router.navigate(["/folio/folio-detalle/", respuesta.body.id]);
      },
      (error) => {
        console.log("error :::" + error);
        this.showNotificationDanger("top", "right");
      }
    );
  }
  buscaFolios(libro) {
    this.libroSeleccionado = libro;
    this.folioService.buscarFolioPorLibro(libro.id).subscribe((respuesta) => {
      if (respuesta.body.length === 0) {
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
        message: "Folio Creado Correctamente ",
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
        message: "Error al crear el Folio",
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
  obtenerPerfilLibroUsuario(idLibro, idUsuario) {
    this.usuarioLibroService
      .buscarlibroPorContrato(idLibro, idUsuario)
      .subscribe((respuesta) => {
        console.log(respuesta.body);
        this.usuario = respuesta.body[0];
      });
  }
}
