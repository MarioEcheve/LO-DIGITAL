import { Component, OnInit, Input } from "@angular/core";
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
import { ModalBuscarFolioComponent } from "../modal-buscar-folio/modal-buscar-folio.component";
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { MatChipInputEvent } from "@angular/material/chips";
import { FolioReferenciaService } from "../../services/folio-referencia.service";
import { FolioReferencia } from "../../TO/folio-referencia.model";
import { element } from "protractor";
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
  receptor = [];
  private fechaRequeridaValidators = [
    Validators.maxLength(250),
  ]
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

  // implementacion de chips
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  folios: any[] = [
   
  ];
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
    private usuarioLibroService: UsuarioLibroService,
    private folioReferenciaService : FolioReferenciaService
  ) {
    this.folioService.clear();
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
      anotacion: [],
      numeroFolio: [],
      emisor: [],
      usuarioPerfilLibro: [],
      usuarioNombre: [],
      perfilUsuario: [],
      respuestaFolio : ["respuesta de "],
      fechaRequeridaDatepicker : ["",this.fechaRequeridaValidators],
      folioReferencia : [],
      receptor : []
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
    
    this.folioService.getListaFolioRelacionadoSubject().subscribe(
      respuesta => {
        if(respuesta.length === 0){
        }else{
          console.log(this.folios.length);
          if(this.folios.length > 0){
            let hash = {};
            this.folios = respuesta;
            this.folios = this.folios.filter(o => hash[o.id] ? false : hash[o.id] = true);
          }else{
              if(respuesta.length === 1){
                console.log(this.folios);
                console.log(respuesta);
                this.folios = respuesta;
              }else{
                let hash = {};
                console.log(this.folios);
                console.log(respuesta.filter(o => hash[o.id] ? false : hash[o.id] = true));
                this.folios = respuesta.filter(o => hash[o.id] ? false : hash[o.id] = true);
              }
          }
        }
      }
    );
  }
  buscarFolio(id) {
    let usuarioActual = JSON.parse(localStorage.getItem("user"));
    this.folioService.find(id).subscribe((respuesta) => {
      this.Folio = respuesta.body;
      this.usuarioLibroService.ListaUsuariosLibros(respuesta.body.libro.id,usuarioActual.id).subscribe(
        respuesta=>{
          console.log('AQUI ESTA LA RESPUESTA DE LOS USUARIOS');
          console.log(respuesta.body);
          this.receptor = respuesta.body;
        }
      );

      this.folioService.foliosReferencias(respuesta.body.id).subscribe(
        respuesta=>{
          this.Folio.folioReferencias = respuesta.body.folioReferencias;
          this.Folio.folioReferencias.forEach(element=>{
            this.folioService.find(element.idFolioReferencia).subscribe(
              folioReferencia=>{
                if(this.folios.length > 0){
                  if(!this.folios.includes(folioReferencia.body)){
                    this.folios = [...this.folios,folioReferencia.body];
                    let hash = {};
                    this.folios = this.folios.filter(o => hash[o.id] ? false : hash[o.id] = true);
                  }else{
                    this.folios = [];
                  }
                }else{
                  let hash = {};
                  this.folios = [...this.folios,folioReferencia.body];
                  this.folios = this.folios.filter(o => hash[o.id] ? false : hash[o.id] = true);
                }
              }
            );
           })
        }
      );
      this.buscaCorrelativoFolio();

      this.obtenerPerfilLibroUsuario(this.Folio.libro.id, usuarioActual.id);
      this.folioForm.controls["asunto"].setValue(respuesta.body.asunto);
      this.folioForm.controls["anotacion"].setValue(respuesta.body.anotacion);
      this.folioForm.controls["requiereRespuesta"].setValue(respuesta.body.requiereRespuesta);
      if(this.folioForm.controls["requiereRespuesta"].value === false){
        this.muestraFechaRequerida = false;
        if(respuesta.body.idFolioRelacionado !== null){
          this.folioService.find(respuesta.body.idFolioRelacionado).subscribe(
            folioRelacionado => {
              this.folioForm.controls["respuestaFolio"].setValue("Respuesta de : "+folioRelacionado.body.libro.nombre+" | " +
                "Folio : " + folioRelacionado.body.numeroFolio 
                )
            }
          );
        }
      }else{
        if(respuesta.body.fechaRequerida !== undefined){
          this.folioForm.get('fechaRequeridaDatepicker').setValidators([Validators.required])
          let fecha =this.Folio.fechaRequerida.local().toISOString().split(":00.000Z");
          this.folioForm.controls["fechaRequeridaDatepicker"].setValue(fecha[0]);
        }
        this.muestraFechaRequerida = true;
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
    this.folioForm.controls["folioReferencia"].disable();
    
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
    if(this.folioForm.controls["fechaRequeridaDatepicker"].value !== ""){
      let fechaRequerida = moment(this.folioForm.controls["fechaRequeridaDatepicker"].value +":00Z");
      this.Folio.fechaRequerida = fechaRequerida;
      console.log(this.folioForm.controls["fechaRequeridaDatepicker"].value);
    }
    else{
      this.Folio.fechaRequerida = undefined;
    }
    console.log(this.folios);
    
    
    if (this.tipoFolioSeleccionado !== "") {
      this.Folio.tipoFolio = this.tipoFolioSeleccionado;
    }
    this.folioService.update(this.Folio).subscribe(
      (respuesta) => {
        if(this.folios.length > 0){
          for(let i =0; i< this.folios.length; i++){
            let folioReferencia = new FolioReferencia;
            folioReferencia.idFolioReferencia = this.folios[i].id;
            folioReferencia.idFolioOrigen = respuesta.body.id;
            folioReferencia.asunto=`Folio Relacionado | asunto : ${this.folios[i].asunto}`
            this.folioReferenciaService.create(folioReferencia).subscribe(
              respuesta2 => {
                respuesta.body.folioReferencias =[];
                respuesta.body.folioReferencias.push(respuesta2.body);
                this.folioService.update(respuesta.body).subscribe();
                
              }
            );
          }
          this.buscarFolio(respuesta.body.id);
          this.showNotificationSuccess("top", "right");
          //this.folioRelacionadoService.create().subscribe();
        }else{ 
          respuesta.body.folioReferencias = [];
          this.folioService.createNewColeccionFolioReferencia([]);
          this.folioService.update(respuesta.body).subscribe(); 
          this.buscarFolio(respuesta.body.id);
          this.showNotificationSuccess("top", "right");
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
        this.Folio.fechaRequerida = this.Folio.fechaRequerida = moment(this.folioForm.controls["fechaRequeridaDatepicker"].value);
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
      res=>{
        if(res){
          this.muestraFechaRequerida = true;
          this.Folio.requiereRespuesta = true; 
          this.folioForm.get('fechaRequeridaDatepicker').setValue(new Date());  
          this.folioForm.get('fechaRequeridaDatepicker').setValidators([Validators.required])
        }
        else{
          this.folioForm.get('fechaRequeridaDatepicker').clearValidators();
          this.muestraFechaRequerida = false;
          this.Folio.requiereRespuesta = false;
          this.folioForm.get('fechaRequeridaDatepicker').setValue("");  
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
        if(this.Folio.idFolioRelacionado !== null){
          // valida si el folio es referenciado
          if(this.folios.length > 0){
            for(let i =0; i< this.folios.length;i++){
              this.folioService.find(this.folios[i].folioReferencias.idFolioOrigen).subscribe(
                folioOrigen=>{
                  folioOrigen.body.folioReferencias = [];
                  this.folioService.update(folioOrigen.body).subscribe();
                }
              );
            }
          }
          this.folioService.find(this.Folio.idFolioRelacionado).subscribe(
            respuesta=>{
              respuesta.body.idFolioRespuesta = null;
              respuesta.body.estadoRespuesta = null;
              this.folioService.update(respuesta.body).subscribe(
                respuesta2=>{
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
                }
              );
            }
          );
        }
        else{
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
  }
  previsualizar() {
    let imagenLogo1 = getBase64Image(document.getElementById("imagenLogo1"));
    let imagenLogo2 = getBase64Image(document.getElementById("imagenLogo2"));
    let anotacion = stripHtml(this.folioForm.controls["anotacion"].value);
    this.Folio.idReceptor = this.folioForm.controls["receptor"].value;
    this.Folio.fechaRequerida = moment(this.folioForm.controls["fechaRequeridaDatepicker"].value);
    let nombreReceptor ="";
    this.usuarioLibroService.find(this.Folio.idReceptor).subscribe(
      respuesta=>{
        nombreReceptor = respuesta.body.usuarioDependencia.usuario.firstName +  respuesta.body.usuarioDependencia.usuario.lastName 
      }
    );
      setTimeout(() => {

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
                      text:
                        "Receptor: " + nombreReceptor,
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
          previsualisar : true,
          lectura : false
        },
      });
    });
      }, 800);
  }
  visualizarPdfOrigen(){
    this.folioService.find(this.Folio.idFolioRelacionado).subscribe(
      folioOrigen => {
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
              usuario: null,
              pdfArchivoCompleto: null,
              previsualisar : false,
              lectura : false
            },
          });
        });
      }
    );
  }
  buscaFolioReferencia(){
    this.folioService.getListaFolioRelacionadoSubject().subscribe(
      respuesta => {
        
      }
    );
    const dialogRef = this.dialog.open(ModalBuscarFolioComponent,{
      width : "100%",
      data : {idContrato : this.libro.contrato.id , folios : this.folios, libro : this.libro}
    });
    dialogRef.afterClosed().subscribe((result) => {
      //console.log(result);
      if (result === null || result === "" || result === undefined) {
      } else {
          //this.folios = [...this.folios,result]; 
          //this.folios = result;
      }
    }
    );
  }
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.folios.push({name: value.trim()});
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(folio: any): void {
    const index = this.folios.indexOf(folio);

    if (index >= 0) {
      if(this.folios.length <= 1){
        this.folios = [];
        this.folioService.removeFolioReferencia(folio,false);
        this.folioService.createNewColeccionFolioReferencia([]);
        this.folioService.clear();
        console.log(this.folios);
      }else{
        this.folios.splice(index, 1);
        this.folioService.removeFolioReferencia(folio);
      }
      
    }
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
