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
    private router: Router
  ) {}

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
    this.obtenerTipoLibros();
    this.obtenerPerfilUsuariolibro();
  }
  desabilitaElementosFormGroup() {
    this.libroInfoGeneralFormGroup.controls["fechaCreacion"].disable();
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
  obtenerTipoLibros() {
    this.tipoLibroService.query().subscribe((respuesta) => {
      this.tipoLibro = respuesta.body;
      // buscamos el contrato para verificar si posee libros creados,
      // si posee solo se dejara crear libros auxiliares
      // si no posee se dejara crear libro maestro por obligacion

      this.libroService
        .buscarlibroPorContrato(this.contrato.id)
        .subscribe((respuesta) => {
          if (respuesta.body.length <= 0) {
            const resutado = this.tipoLibro.filter(
              (tipo) => tipo.descripcion.toLowerCase() === "maestro"
            );
            this.tipoLibro = resutado;
          } else {
            const resutado = this.tipoLibro.filter(
              (tipo) => tipo.descripcion.toLowerCase() === "auxiliar"
            );
            this.tipoLibro = resutado;
          }
        });
    });
  }
  obtenerContrato() {
    this.contratoService.find(this.idContrato).subscribe((respuesta) => {
      this.contrato = respuesta.body;
      // obtener los usuarios para el mandante y el contratista
      // mandante
      this.dependenciaService
        .buscaUsuariosDependencia(this.contrato.dependenciaMandante.id)
        .subscribe((respuesta) => {
          //console.log(respuesta);
          this.listaUsuarios = respuesta.body;
          this.muestraListaUsuarios = true;
        });
      this.dependenciaService
        .buscaUsuariosDependencia(this.contrato.idDependenciaContratista)
        .subscribe((respuesta) => {
          //console.log(respuesta);
          this.listaUsuariosContratista = respuesta.body;
          this.muestraListaUsuarios = true;
        });
    });
  }
  modalCrearUsuario() {
    const dialogRef = this.dialog.open(CrearUsuarioComponent, {
      width: "40%",
      data: {
        usuarioLibroPerfil: this.usuarioLibroPerfil,
        usuariosDependenciaMandante: this.listaUsuarios,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      //console.log(result);
      if (result === undefined || result === false) {
      } else {
        // contamos si el valor de la lista es mayor a 0
        if (this.usuariosAgregados.length > 0) {
          console.log(this.usuariosAgregados);
          for (var i = 0; i < this.usuariosAgregados.length; i++) {
            if (
              this.usuariosAgregados[i].idUsuarioDependencia ===
              result.idUsuarioDependencia
            ) {
              this.usuariosAgregados.splice(i);
              this.usuariosAgregados.push(result);
            } else {
              if (
                this.usuariosAgregados[i].perfilUsuarioLibro.nombre ===
                result.perfilUsuarioLibro.nombre
              ) {
                if (
                  result.perfilUsuarioLibro.nombre.toLowerCase() ===
                  "administrador"
                ) {
                  this.usuarioDependenciaService
                    .find(result.idUsuarioDependencia)
                    .subscribe((respuesta) => {
                      console.log(respuesta.body);
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
                this.usuariosAgregados.splice(i);
                this.usuariosAgregados.push(result);
              } else {
                this.usuariosAgregados.push(result);
              }
            }
          }
        } else {
          // si no lo es insertamos directamente
          if (
            result.perfilUsuarioLibro.nombre.toLowerCase() === "administrador"
          ) {
            console.log("admin");
            this.usuarioDependenciaService
              .find(result.idUsuarioDependencia)
              .subscribe((respuesta) => {
                console.log(respuesta.body);
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
    const dialogRef = this.dialog.open(CrearUsuarioComponent, {
      width: "40%",
      data: {
        usuarioLibroPerfil: this.usuarioLibroPerfil,
        usuariosDependenciaMandante: this.listaUsuariosContratista,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      //console.log(result);
      if (result === undefined || result === false) {
      } else {
        // contamos si el valor de la lista es mayor a 0
        if (this.usuariosAgregadosContratista.length > 0) {
          console.log(this.usuariosAgregadosContratista);
          for (var i = 0; i < this.usuariosAgregadosContratista.length; i++) {
            if (
              this.usuariosAgregadosContratista[i].idUsuarioDependencia ===
              result.idUsuarioDependencia
            ) {
              this.usuariosAgregadosContratista.splice(i);
              this.usuariosAgregadosContratista.push(result);
            } else {
              if (
                this.usuariosAgregadosContratista[i].perfilUsuarioLibro
                  .nombre === result.perfilUsuarioLibro.nombre
              ) {
                if (
                  result.perfilUsuarioLibro.nombre.toLowerCase() ===
                  "administrador"
                ) {
                  this.usuarioDependenciaService
                    .find(result.idUsuarioDependencia)
                    .subscribe((respuesta) => {
                      console.log(respuesta.body);
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
                }
                this.usuariosAgregadosContratista.splice(i);
                this.usuariosAgregadosContratista.push(result);
              } else {
                this.usuariosAgregadosContratista.push(result);
              }
            }
          }
        } else {
          // si no lo es insertamos directamente
          if (
            result.perfilUsuarioLibro.nombre.toLowerCase() === "administrador"
          ) {
            console.log("admin");
            this.usuarioDependenciaService
              .find(result.idUsuarioDependencia)
              .subscribe((respuesta) => {
                console.log(respuesta.body);
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
    //console.log(this.permisosFormGroup.value);
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
    libro.estadoLibro = null;

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
      console.log(this.usuariosAgregados[i]);
      this.usuariosAgregados[i].libro = libro;
      this.usuarioLibroService
        .create(this.usuariosAgregados[i])
        .subscribe((respuesta) => {});
    }
  }
  guardaUsuariosContratista(libro) {
    for (var i = 0; i < this.usuariosAgregadosContratista.length; i++) {
      console.log(this.usuariosAgregadosContratista[i]);
      this.usuariosAgregadosContratista[i].libro = libro;
      this.usuarioLibroService
        .create(this.usuariosAgregados[i])
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
}
