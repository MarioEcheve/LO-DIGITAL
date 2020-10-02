import { Component, OnInit } from "@angular/core";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { TipoLibroService } from "../../services/tipo-libro.service";
import { TipoFirmaService } from "../../services/tipo-firma.service";
import { DependenciaService } from "../../services/dependencia.service";
import { ITipoFirma } from "../../TO/tipo-firma.model";
import { ITipoLibro } from "../../TO/tipo-libro.model";
import { ContratoService } from "../../services/contrato.service";
import { ActivatedRoute, Router } from "@angular/router";
import { IContrato, Contrato } from "../../TO/contrato.model";
import { MatDialog } from "@angular/material/dialog";
import { CrearUsuarioComponent } from "../../componentes/crear-usuario/crear-usuario.component";
import { UsuarioLibroPerfilService } from "../../services/usuario-libro-perfil.service";
import { IUsuarioLibro, UsuarioLibro } from "../../TO/usuario-libro.model";
import { UsuarioService } from "src/app/core/user/usuario.service";
import { UsuarioDependenciaService } from "../../services/usuario-dependencia.service";
import { Libro } from "../../TO/libro.model";
import { LibroService } from "../../services/libro.service";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { UsuarioLibroService } from "../../services/usuario-libro.service";
import { EstadoLibroService } from "../../services/estado-libro.service";
import * as moment from "moment";
declare interface TableData {
  headerRow: string[];
  dataRows: string[][];
}
declare const $: any;
@Component({
  selector: "app-libro",
  templateUrl: "./libro.component.html",
  styleUrls: ["./libro.component.css"],
})
export class LibroComponent implements OnInit {
  public tableData2: TableData;
  libroInfoGeneralFormGroup: FormGroup;
  permisosFormGroup: FormGroup;
  tipoFirma: ITipoFirma[];
  tipoLibro: ITipoLibro[];
  idContrato: any;
  contrato: IContrato;
  muestraListaUsuarios = false;
  listaUsuarios = [];
  usuarioLibroPerfil: IUsuarioLibro[];
  usuariosAgregados: IUsuarioLibro[] = [];
  listaUsuariosContratista = [];
  usuariosAgregadosContratista: IUsuarioLibro[] = [];
  estadoLibro;
  editar = false;
  listaUsuarioMandante = [];
  listaUsuarioContratista = [];
  muestraTabUsuarioMandante = false;
  muestraTabUsuarioContratista = false;
  constructor(
    private fb: FormBuilder,
    private tipoLibroService: TipoLibroService,
    private tipoFirmaService: TipoFirmaService,
    private contratoService: ContratoService,
    private route: ActivatedRoute,
    private dependenciaService: DependenciaService,
    private dialog: MatDialog,
    private perfilUsuarioLibro: UsuarioLibroPerfilService,
    private usuarioService: UsuarioService,
    private usuarioDependenciaService: UsuarioDependenciaService,
    private libroService: LibroService,
    private usuarioLibroService: UsuarioLibroService,
    private router: Router,
    private estadoLibroService: EstadoLibroService
  ) {
   
  }

  ngOnInit(): void {
    this.tableData2 = {
      headerRow: ["RUT", "Nombre", "Cargo", "Perfil", "Estado", "Acción"],
      dataRows: [],
    };

    this.libroInfoGeneralFormGroup = this.fb.group({
      codigo: ["", [Validators.required]],
      nombre: [],
      descripcion: [],
      fechaCreacion: [],
      fechaApertura: [],
      fechaCierre: [],
      tipoLibro: [, Validators.required],
      tipoFirma: [],
      estadoLibro: [],
      rutAdminMandante: [],
      nombreAdminMandante: [],
      perfilUsuarioAdminMandante: [],
      fechaAsignacionAdminMandante: [],
      cargoAdminMandante: [],
      telefonoAdminMandante: [],
      emailAdminMandante: [],
      entidadAdminMandante: [],
      rutEntidadAdminMandante: [],
      dependenciaEntidadMandante: [],
      rutAdminContratista: [],
      nombreAdminContratista: [],
      perfilUsuarioAdminContratista: [],
      fechaAsignacionAdminContratista: [],
      cargoAdminContratista: [],
      telefonoAdminContratista: [],
      emailAdminContratista: [],
      entidadAdminContratista: [],
      rutEntidadAdminContratista: [],
      dependenciaEntidadContratista: [],
    });

    this.permisosFormGroup = this.fb.group({
      aperturaMandante: [false],
      aperturaContratista: [false],
      escrituraMandante: [false],
      escrituraContratista: [false],
      cierreMandante: [false],
      cierreContratista: [false],
      lecturaMandante: [false],
      lecturaContratista: [false],
    });

    this.idContrato = this.route.snapshot.paramMap.get("id");
    this.desabilitaElementosFormGroup();
    this.obtenerContrato();
    this.obtenerTipoFirmas();
    this.obtenerTipoLibros(this.idContrato);
    this.obtenerPerfilUsuariolibro();
    this.obtenerEstadoLibro();
    this.usuarioDependenciaLogeado();
  }
  desabilitaElementosFormGroup() {
    this.libroInfoGeneralFormGroup.controls["fechaCreacion"].disable();
    this.libroInfoGeneralFormGroup.controls["estadoLibro"].disable();
    this.libroInfoGeneralFormGroup.controls["fechaCierre"].disable();
    this.libroInfoGeneralFormGroup.controls["fechaApertura"].disable();
    this.libroInfoGeneralFormGroup.controls["rutAdminMandante"].disable();
    this.libroInfoGeneralFormGroup.controls["nombreAdminMandante"].disable();
    this.libroInfoGeneralFormGroup.controls[
      "perfilUsuarioAdminMandante"
    ].disable();
    this.libroInfoGeneralFormGroup.controls[
      "fechaAsignacionAdminMandante"
    ].disable();
    this.libroInfoGeneralFormGroup.controls["cargoAdminMandante"].disable();
    this.libroInfoGeneralFormGroup.controls["telefonoAdminMandante"].disable();
    this.libroInfoGeneralFormGroup.controls["emailAdminMandante"].disable();
    this.libroInfoGeneralFormGroup.controls["entidadAdminMandante"].disable();
    this.libroInfoGeneralFormGroup.controls[
      "rutEntidadAdminMandante"
    ].disable();
    this.libroInfoGeneralFormGroup.controls[
      "dependenciaEntidadMandante"
    ].disable();
    this.libroInfoGeneralFormGroup.controls["rutAdminContratista"].disable();
    this.libroInfoGeneralFormGroup.controls["nombreAdminContratista"].disable();
    this.libroInfoGeneralFormGroup.controls[
      "perfilUsuarioAdminContratista"
    ].disable();
    this.libroInfoGeneralFormGroup.controls[
      "fechaAsignacionAdminContratista"
    ].disable();
    this.libroInfoGeneralFormGroup.controls["cargoAdminContratista"].disable();
    this.libroInfoGeneralFormGroup.controls[
      "telefonoAdminContratista"
    ].disable();
    this.libroInfoGeneralFormGroup.controls["emailAdminContratista"].disable();
    this.libroInfoGeneralFormGroup.controls[
      "entidadAdminContratista"
    ].disable();
    this.libroInfoGeneralFormGroup.controls[
      "rutEntidadAdminContratista"
    ].disable();
    this.libroInfoGeneralFormGroup.controls[
      "dependenciaEntidadContratista"
    ].disable();
  }
  obtenerTipoFirmas() {
    this.tipoFirmaService.query().subscribe((respuesta) => {
      this.tipoFirma = respuesta.body;
    });
  }
  obtenerTipoLibros(idContrado? :number) {
    let resultado;
    this.tipoLibroService.query().subscribe((tipoLibro) => {
      resultado = tipoLibro.body;
      this.libroService
        .buscarlibroPorContrato(idContrado)
        .subscribe((libro) => {
          if (libro.body.length <= 0) {
             resultado = resultado.filter((tipo) => tipo.descripcion.toLowerCase() === "maestro");
          } else {
            resultado = resultado.filter((tipo) => tipo.descripcion.toLowerCase() === "auxiliar");
          }
        });
        setTimeout(() => {
          this.tipoLibro =resultado;
        }, 500);
    });
  }
  obtenerEstadoLibro() {
    this.estadoLibroService.query().subscribe((respuesta) => {
      for (var i = 0; i < respuesta.body.length; i++) {
        if (
          respuesta.body[i].nombre === "En creacion" ||
          respuesta.body[i].nombre.toLowerCase() === "en creacion"
        ) {
          this.libroInfoGeneralFormGroup.controls["estadoLibro"].setValue(
            respuesta.body[i].nombre
          );
          this.estadoLibro = respuesta.body[i];
        }
      }
    });
  }
  obtenerContrato() {
    this.contratoService.find(this.idContrato).subscribe((respuesta) => {
      this.contrato = respuesta.body;
      this.muestraListaUsuarios = true;
      // obtener los usuarios para el mandante y el contratista
      // mandante
      this.dependenciaService
        .buscaUsuariosDependencia(this.contrato.dependenciaMandante.id)
        .subscribe((respuesta) => {
          this.listaUsuarios = respuesta.body;
          this.muestraListaUsuarios = true;
        });
      this.dependenciaService
        .buscaUsuariosDependencia(this.contrato.idDependenciaContratista)
        .subscribe((respuesta) => {
          this.listaUsuariosContratista = respuesta.body;
          this.muestraListaUsuarios = true;
        });
    });
  }
  modalCrearUsuario() {
    let existe = false;
    if( this.usuariosAgregados.length > 0 ){
      this.usuariosAgregados.forEach(
        element=>{
          if(element.adminActivo === true){
            existe= true;
          }
        }
      );
    }else{
      existe = false;
    }
    let listaUsuariosFiltrados = this.listaUsuarios.filter((usuarios:any)=>{
      let res = this.usuariosAgregados.find((usuarioMandante)=>{
         return usuarioMandante.usuarioDependencia.id == usuarios.id;
         });
        return res == undefined;
      });
    this.editar = false;
    const dialogRef = this.dialog.open(CrearUsuarioComponent, {
      width: "500px",
      data: {
        usuarioLibroPerfil: this.usuarioLibroPerfil,
        usuariosDependenciaMandante: listaUsuariosFiltrados,
        editar : this.editar,
        usuarioEditar : {},
        existe : existe
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === undefined || result === false || result === "") {
      } else {
        // contamos si el valor de la lista es mayor a 0
        if (this.usuariosAgregados.length > 0) {
          for (var i = 0; i < this.usuariosAgregados.length; i++) {
            if (
              this.usuariosAgregados[i].idUsuarioDependencia ===
              result.idUsuarioDependencia
            ) {
              this.usuariosAgregados.splice(i);
              this.usuariosAgregados.push(result);
            } else {
                if (
                  result.perfilUsuarioLibro.nombre.toLowerCase() ===
                  "administrador"
                ) {
                  this.usuarioDependenciaService
                    .find(result.idUsuarioDependencia)
                    .subscribe((respuesta) => {
                      this.libroInfoGeneralFormGroup.controls[
                        "rutAdminMandante"
                      ].setValue("");
                      this.libroInfoGeneralFormGroup.controls[
                        "nombreAdminMandante"
                      ].setValue(respuesta.body.usuario.firstName);
                      this.libroInfoGeneralFormGroup.controls[
                        "perfilUsuarioAdminMandante"
                      ].setValue(
                        respuesta.body.perfilUsuarioDependencia.nombre
                      );
                      this.libroInfoGeneralFormGroup.controls[
                        "cargoAdminMandante"
                      ].setValue(result.cargoFuncion);
                      this.libroInfoGeneralFormGroup.controls[
                        "entidadAdminMandante"
                      ].setValue(respuesta.body.dependencia.entidad.nombre);
                      this.libroInfoGeneralFormGroup.controls[
                        "rutEntidadAdminMandante"
                      ].setValue(respuesta.body.dependencia.entidad.rut);
                      this.libroInfoGeneralFormGroup.controls[
                        "dependenciaEntidadMandante"
                      ].setValue(respuesta.body.dependencia.nombre);
                      this.libroInfoGeneralFormGroup.controls[
                        "emailAdminMandante"
                      ].setValue(respuesta.body.usuario.email);
                    });
                }
                this.usuariosAgregados.push(result);
            }
          }
        } else {
          // si no lo es insertamos directamente
          if (
            result.perfilUsuarioLibro.nombre.toLowerCase() === "administrador"
          ) {
            this.usuarioDependenciaService
              .find(result.idUsuarioDependencia)
              .subscribe((respuesta) => {
                this.libroInfoGeneralFormGroup.controls[
                  "rutAdminMandante"
                ].setValue("");
                this.libroInfoGeneralFormGroup.controls[
                  "nombreAdminMandante"
                ].setValue(respuesta.body.usuario.firstName);
                this.libroInfoGeneralFormGroup.controls[
                  "perfilUsuarioAdminMandante"
                ].setValue(respuesta.body.perfilUsuarioDependencia.nombre);
                this.libroInfoGeneralFormGroup.controls[
                  "cargoAdminMandante"
                ].setValue(result.cargoFuncion);
                this.libroInfoGeneralFormGroup.controls[
                  "entidadAdminMandante"
                ].setValue(respuesta.body.dependencia.entidad.nombre);
                this.libroInfoGeneralFormGroup.controls[
                  "rutEntidadAdminMandante"
                ].setValue(respuesta.body.dependencia.entidad.rut);
                this.libroInfoGeneralFormGroup.controls[
                  "dependenciaEntidadMandante"
                ].setValue(respuesta.body.dependencia.nombre);
                this.libroInfoGeneralFormGroup.controls[
                  "emailAdminMandante"
                ].setValue(respuesta.body.usuario.email);
              });
          }
          this.usuariosAgregados.push(result);
        }
      }
    });
  }
  obtenerPerfilUsuariolibro() {
    this.perfilUsuarioLibro.query().subscribe((respuesta) => {
      this.usuarioLibroPerfil = respuesta.body;
    });
  }
  modalCrearUsuarioContratista() {
    let existe = false;
    if( this.usuariosAgregadosContratista.length > 0 ){
      this.usuariosAgregadosContratista.forEach(
        element=>{
          if(element.adminActivo === true){
            existe= true;
          }
        }
      );
    }else{
      existe = false;
    }
    let listaUsuariosFiltrados = this.listaUsuariosContratista.filter((usuarios:any)=>{
      let res = this.usuariosAgregadosContratista.find((usuarioMandante)=>{
         return usuarioMandante.usuarioDependencia.id == usuarios.id;
         });
        return res == undefined;
      });
    this.editar = false;
    const dialogRef = this.dialog.open(CrearUsuarioComponent, {
      width: "40%",
      data: {
        usuarioLibroPerfil: this.usuarioLibroPerfil,
        usuariosDependenciaMandante: listaUsuariosFiltrados,
        editar : this.editar,
        usuarioEditar : {},
        existe : existe
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === undefined || result === false) {
      } else {
        // contamos si el valor de la lista es mayor a 0
        if (this.usuariosAgregadosContratista.length > 0) {
          for (var i = 0; i < this.usuariosAgregadosContratista.length; i++) {
            if (
              this.usuariosAgregadosContratista[i].idUsuarioDependencia ===
              result.idUsuarioDependencia
            ) {
              this.usuariosAgregadosContratista.splice(i);
              this.usuariosAgregadosContratista = [...this.usuariosAgregadosContratista, result];
            } else {
                if (
                  result.perfilUsuarioLibro.nombre.toLowerCase() ===
                  "administrador"
                ) {
                  this.usuarioDependenciaService
                    .find(result.idUsuarioDependencia)
                    .subscribe((respuesta) => {
                      this.libroInfoGeneralFormGroup.controls[
                        "rutAdminContratista"
                      ].setValue("");
                      this.libroInfoGeneralFormGroup.controls[
                        "nombreAdminContratista"
                      ].setValue(respuesta.body.usuario.firstName);
                      this.libroInfoGeneralFormGroup.controls[
                        "perfilUsuarioAdminContratista"
                      ].setValue(
                        respuesta.body.perfilUsuarioDependencia.nombre
                      );
                      this.libroInfoGeneralFormGroup.controls[
                        "cargoAdminContratista"
                      ].setValue(result.cargoFuncion);
                      this.libroInfoGeneralFormGroup.controls[
                        "entidadAdminContratista"
                      ].setValue(respuesta.body.dependencia.entidad.nombre);
                      this.libroInfoGeneralFormGroup.controls[
                        "rutEntidadAdminContratista"
                      ].setValue(respuesta.body.dependencia.entidad.rut);
                      this.libroInfoGeneralFormGroup.controls[
                        "dependenciaEntidadContratista"
                      ].setValue(respuesta.body.dependencia.nombre);
                      this.libroInfoGeneralFormGroup.controls[
                        "emailAdminContratista"
                      ].setValue(respuesta.body.usuario.email);
                    });
                    this.usuariosAgregadosContratista = [...this.usuariosAgregadosContratista, result];

                }else{
                  this.usuariosAgregadosContratista = [...this.usuariosAgregadosContratista, result];
                }
            }
          }
        } else {
          // si no lo es insertamos directamente
          if (
            result.perfilUsuarioLibro.nombre.toLowerCase() === "administrador"
          ) {
            this.usuarioDependenciaService
              .find(result.idUsuarioDependencia)
              .subscribe((respuesta) => {
                this.libroInfoGeneralFormGroup.controls[
                  "rutAdminContratista"
                ].setValue("");
                this.libroInfoGeneralFormGroup.controls[
                  "nombreAdminContratista"
                ].setValue(respuesta.body.usuario.firstName);
                this.libroInfoGeneralFormGroup.controls[
                  "perfilUsuarioAdminContratista"
                ].setValue(respuesta.body.perfilUsuarioDependencia.nombre);
                this.libroInfoGeneralFormGroup.controls[
                  "cargoAdminContratista"
                ].setValue(result.cargoFuncion);
                this.libroInfoGeneralFormGroup.controls[
                  "entidadAdminContratista"
                ].setValue(respuesta.body.dependencia.entidad.nombre);
                this.libroInfoGeneralFormGroup.controls[
                  "rutEntidadAdminContratista"
                ].setValue(respuesta.body.dependencia.entidad.rut);
                this.libroInfoGeneralFormGroup.controls[
                  "dependenciaEntidadContratista"
                ].setValue(respuesta.body.dependencia.nombre);
                this.libroInfoGeneralFormGroup.controls[
                  "emailAdminContratista"
                ].setValue(respuesta.body.usuario.email);
              });
          }
          this.usuariosAgregadosContratista.push(result);
        }
      }
    });
  }
  guardaLibro() {
    let libro = new Libro();
    libro.aperturaContratista = this.permisosFormGroup.controls[
      "aperturaContratista"
    ].value;
    libro.aperturaMandante = this.permisosFormGroup.controls[
      "aperturaMandante"
    ].value;
    libro.cierreMandante = this.permisosFormGroup.controls[
      "cierreMandante"
    ].value;
    libro.codigo = this.libroInfoGeneralFormGroup.controls["codigo"].value;
    libro.descripcion = this.libroInfoGeneralFormGroup.controls[
      "descripcion"
    ].value;
    libro.escrituraContratista = this.permisosFormGroup.controls[
      "escrituraContratista"
    ].value;
    libro.escrituraMandante = this.permisosFormGroup.controls[
      "escrituraMandante"
    ].value;
    libro.lecturaContratista = this.permisosFormGroup.controls[
      "lecturaContratista"
    ].value;
    libro.lecturaMandante = this.permisosFormGroup.controls[
      "lecturaMandante"
    ].value;
    libro.nombre = this.libroInfoGeneralFormGroup.controls["nombre"].value;
    libro.tipoFirma = this.libroInfoGeneralFormGroup.controls[
      "tipoFirma"
    ].value;
    libro.tipoLibro = this.libroInfoGeneralFormGroup.controls[
      "tipoLibro"
    ].value;
    libro.contrato = this.contrato;
    libro.estadoLibro = this.estadoLibro;
    libro.fechaCreacion = moment(Date.now());

    this.libroService.create(libro).subscribe(
      (respuesta) => {
        this.showNotificationSuccess("top", "right");
        // guarda usuarios mandante
        this.guardaUsuariosMandante(respuesta.body);
        // guarda usuarios contratista
        this.guardaUsuariosContratista(respuesta.body);
        this.router.navigate(["/contrato/detalle-contrato/", this.idContrato]);
      },
      (error) => {
        this.showNotificationDanger("top", "right");
      }
    );
  }
  guardaUsuariosMandante(libro) {
    for (var i = 0; i < this.usuariosAgregados.length; i++) {
      this.usuariosAgregados[i].libro = libro;
      this.usuariosAgregados[i].fechaCreacion = moment(Date.now());
      this.usuarioLibroService
        .create(this.usuariosAgregados[i])
        .subscribe((respuesta) => {});
    }
  }
  guardaUsuariosContratista(libro) {
    for (var i = 0; i < this.usuariosAgregadosContratista.length; i++) {
      this.usuariosAgregadosContratista[i].libro = libro;
      this.usuariosAgregadosContratista[i].fechaCreacion = moment(Date.now());
      this.usuarioLibroService
        .create(this.usuariosAgregadosContratista[i])
        .subscribe((respuesta) => {});
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
        message: "Libro Creado Correctamente ",
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
        message: "Error al crear el Libro",
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
  editarUsuario(row){
    let existe = false;
    if(this.usuariosAgregados.length > 0){
      this.usuariosAgregados.forEach(
        element=>{
          if(element.adminActivo === true){
            existe= true;
          }
        }
      );
    }else{
      existe=false;
    }
    this.editar = true;
    const dialogRef = this.dialog.open(CrearUsuarioComponent, {
      width: "500px",
      data: {
        usuarioLibroPerfil: this.usuarioLibroPerfil,
        usuariosDependenciaMandante: this.listaUsuarios,
        editar : this.editar,
        usuarioEditar : row,
        existe : existe
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === undefined || result === false) {
      } else {
      }
    });
  }
  editarUsuarioContratista(row){
    let existe = false;
    if(this.usuariosAgregadosContratista.length > 0){
      this.usuariosAgregadosContratista.forEach(
        element=>{
          if(element.adminActivo === true){
            existe= true;
          }
        }
      );
    }else{
      existe=false;
    }
    this.editar = true;
    const dialogRef = this.dialog.open(CrearUsuarioComponent, {
      width: "500px",
      data: {
        usuarioLibroPerfil: this.usuarioLibroPerfil,
        usuariosDependenciaMandante: this.listaUsuarios,
        editar : this.editar,
        usuarioEditar : row,
        existe : existe
      },
    });
  }
  usuarioDependenciaLogeado(){
    let usuarioActual = JSON.parse(localStorage.getItem("user"));

    this.usuarioDependenciaService.findUserByUsuarioDependencia(usuarioActual.id).subscribe(
      response => {
        console.log(response.body);
        if(this.contrato.dependenciaMandante.id === response.body[0].dependencia.id){
            this.muestraTabUsuarioMandante = true;
            this.muestraTabUsuarioContratista = false;
        }else{
          this.muestraTabUsuarioMandante = false;
          this.muestraTabUsuarioContratista = true;
        }
      } 
    );
  }
}
