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
declare var $: any;
declare interface TableData {
  headerRow: string[];
  dataRows: string[][];
}
@Component({
  selector: "app-folio-borrador",
  templateUrl: "./folio-borrador.component.html",
  styleUrls: ["./folio-borrador.component.css"],
})
export class FolioBorradorComponent implements OnInit {
  public tableData1: TableData;
  libro = new Libro();
  dependenciaContratista = new Dependencia();
  tipoFolio: ITipoFolio[];
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
    private router: Router
  ) {}

  ngOnInit() {
    this.folioForm = this.fb.group({
      asunto: ["", Validators.required],
      entidadCreacion: [null],
      estadoFolio: [false],
      estadoLectura: [null],
      estadoRespuesta: [null],
      fechaCreacion: [null],
      fechaFirma: [null],
      fechaLectura: [null],
      fechaModificacion: [null],
      fechaRequerida: [null],
      libro: [""],
      requiereRespuesta: [null],
      tipoFolio: ["", Validators.required],
      anotacion: [],
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
    let idLibro = this.route.snapshot.paramMap.get("id");
    this.buscarLibro(idLibro);
    this.obtenerTipoFolio();
    this.buscarFolioPorLibro(idLibro);
  }
  buscarLibro(id) {
    this.libroService.find(id).subscribe((respuesta) => {
      console.log(respuesta.body);
      this.libro = respuesta.body;
      this.dependenciaService
        .find(respuesta.body.contrato.idDependenciaContratista)
        .subscribe((respuesta) => {
          this.dependenciaContratista = respuesta.body;
        });
    });
  }
  obtenerTipoFolio() {
    this.tipoFolioService.query().subscribe((respuesta) => {
      this.tipoFolio = respuesta.body;
    });
  }
  guardarFolio() {
    console.log(this.folioForm.value);
    let fecha = new Date();
    console.log(fecha);
    this.folioForm.controls["libro"].setValue(this.libro);
    this.folioForm.controls["fechaCreacion"].setValue(moment(Date.now()));
    this.folioService.create(this.folioForm.value).subscribe(
      (respuesta) => {
        console.log(respuesta);
        this.showNotificationSuccess("top", "right");
        this.router.navigate(["/folio/folio/", this.libro.contrato.id]);
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
        console.log("menor");
        console.log(this.tipoFolio);
      } else {
        this.tipoFolio = this.tipoFolio.filter(
          (tipo) => tipo.nombre.toLowerCase() !== "apertura libro"
        );
        console.log("Mayor");
        console.log(this.tipoFolio);
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
}
