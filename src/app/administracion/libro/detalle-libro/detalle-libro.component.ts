import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { LibroService } from "../../services/libro.service";
import { ILibro } from "../../TO/libro.model";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { FolioService } from "../../services/folio.service";
import { TipoLibroService } from "../../services/tipo-libro.service";
import { TipoFirmaService } from "../../services/tipo-firma.service";
import { ITipoLibro } from "../../TO/tipo-libro.model";
import { TipoFirma } from "../../TO/tipo-firma.model";
import { DatePipe } from "@angular/common";
import { UsuarioLibroService } from "../../services/usuario-libro.service";
import { UsuarioLibro, IUsuarioLibro } from "../../TO/usuario-libro.model";
import { MatDialog } from "@angular/material/dialog";
import { CrearUsuarioComponent } from "../../componentes/crear-usuario/crear-usuario.component";
import { ContratoService } from "../../services/contrato.service";
import { Contrato } from "../../TO/contrato.model";
import { DependenciaService } from "../../services/dependencia.service";
import { User } from "src/app/core/user/user.model";
import { UsuarioLibroPerfilService } from "../../services/usuario-libro-perfil.service";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { UsuarioDependenciaService } from "../../services/usuario-dependencia.service";
declare const $: any;
declare interface TableData {
  headerRow: string[];
  dataRows: string[][];
}
@Component({
  selector: "app-detalle-libro",
  templateUrl: "./detalle-libro.component.html",
  styleUrls: ["./detalle-libro.component.css"],
})
export class DetalleLibroComponent implements OnInit {
  public tableData2: TableData;
  libro: ILibro;
  abrirLibroMostrar = false;
  libroInfoGeneralFormGroup: FormGroup;
  permisosFormGroup: FormGroup;
  tipoLibro: ITipoLibro[];
  tipoFirma: TipoFirma[];
  usuariosLibros : UsuarioLibro[];
  listaUsuarioMandante = [];
  listaUsuarioContratistaAgregados = [];
  contrato :  Contrato;
  listaUsuarioContratista = [];
  muestraListaUsuarios = false;
  listaUsuarios : User[] = [];
  listaUsuariosOrigen : User[] = [];
  listaUsuariosContratista: User[] = [];
  listaUsuariosContratistaOrigen: User[] = [];
  usuarioLibroPerfil: IUsuarioLibro[];
  usuarioEliminadosSersionMandante = [];
  usuarioEliminadosContratista = [];
  editar = false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private libroService: LibroService,
    private folio: FolioService,
    private fb: FormBuilder,
    private tipoLibroService: TipoLibroService,
    private tipoFirmaService: TipoFirmaService,
    public datepipe: DatePipe,
    private usuarioLibroService : UsuarioLibroService,
    private dialog: MatDialog,
    private contratoService : ContratoService,
    private dependenciaService : DependenciaService,
    private perfilUsuarioLibro : UsuarioLibroPerfilService,
    private usuarioDependenciaService: UsuarioDependenciaService,
    private folioService : FolioService
  ) {}

  ngOnInit(): void {
    this.folioService.navBarChange(2);
    let idLibro = this.route.snapshot.paramMap.get("id");
    this.inicializadorForms();
    this.tableData2 = {
      headerRow: ["RUT", "Nombre", "Cargo", "Perfil", "Estado", "Acción"],
      dataRows: [
        [
          "15.547.454-6",
          "Nombre ApellidoP ApellidoM",
          "Inspector Fiscal",
          "Administrador",
          "Activo",
          "btn-link",
        ],
        [
          "14.774.524-3",
          "Nombre ApellidoP ApellidoM",
          "Asistente ITO",
          "Asistente",
          "Abierto",
          "btn-link",
        ],
        [
          "12.774.524-3",
          "Nombre ApellidoP ApellidoM",
          "Inpector Fiscal (S)",
          "Administrador (s)",
          "Activo",
          "btn-link",
        ],
        [
          "16.774.524-3",
          "Nombre ApellidoP ApellidoM",
          "Jefe Area Construcción",
          "Superior",
          "Activo",
          "btn-link",
        ],
        [
          "18.774.524-3",
          "Nombre ApellidoP ApellidoM",
          "Secretaria Administrativa",
          "Visita",
          "Inactivo",
          "btn-link",
        ],
      ],
    };
    this.obtenerLibro(parseInt(this.route.snapshot.paramMap.get("id")));
    this.obtenerTipoLibro();
    this.obtenerTipoFirma();
    this.obtenerPerfilUsuariolibro();
    this.usuarioLibroService.usuariosPorLibro(parseInt(idLibro)).subscribe(
      usuariosLibros=>{
        this.usuariosLibros = usuariosLibros.body;
        this.usuariosLibros.forEach(element=>{
          if(element.usuarioDependencia.dependencia.id === this.libro.contrato.dependenciaMandante.id){
            if(element.estado === true){
              element.nombreEstado = "Activo";
            }else{
              element.nombreEstado = "Inactivo";
            }
            if(element.adminActivo === true){
              this.libroInfoGeneralFormGroup.controls["nombreAdminMandante"].setValue(element.usuarioDependencia.usuario.firstName + ' ' + element.usuarioDependencia.usuario.lastName);
              this.libroInfoGeneralFormGroup.controls["perfilUsuarioAdminMandante"].setValue(element.perfilUsuarioLibro.nombre);
              this.libroInfoGeneralFormGroup.controls["cargoAdminMandante"].setValue(element.cargoFuncion);
              this.libroInfoGeneralFormGroup.controls["entidadAdminMandante"].setValue(element.usuarioDependencia.dependencia.entidad.nombre);
              this.libroInfoGeneralFormGroup.controls["rutEntidadAdminMandante"].setValue(element.usuarioDependencia.dependencia.entidad.rut);
              this.libroInfoGeneralFormGroup.controls["dependenciaEntidadMandante"].setValue(element.usuarioDependencia.dependencia.nombre);
              this.libroInfoGeneralFormGroup.controls["emailAdminMandante"].setValue(element.usuarioDependencia.usuario.email);
            }
            this.listaUsuarioMandante = [...this.listaUsuarioMandante, element];
            console.log(this.listaUsuarioMandante);
          }else{
            if(element.estado === true){
              element.nombreEstado = "Activo";
            }else{
              element.nombreEstado = "Inactivo";
            }
            if(element.adminActivo === true){
              this.libroInfoGeneralFormGroup.controls["nombreAdminContratista"].setValue(element.usuarioDependencia.usuario.firstName + ' ' + element.usuarioDependencia.usuario.lastName);
              this.libroInfoGeneralFormGroup.controls["perfilUsuarioAdminContratista"].setValue(element.perfilUsuarioLibro.nombre);
              this.libroInfoGeneralFormGroup.controls["cargoAdminContratista"].setValue(element.cargoFuncion);
              this.libroInfoGeneralFormGroup.controls["emailAdminContratista"].setValue(element.usuarioDependencia.usuario.email);
              this.libroInfoGeneralFormGroup.controls["entidadAdminContratista"].setValue(element.usuarioDependencia.dependencia.entidad.nombre);
              this.libroInfoGeneralFormGroup.controls["rutEntidadAdminContratista"].setValue(element.usuarioDependencia.dependencia.entidad.rut);
              this.libroInfoGeneralFormGroup.controls["dependenciaEntidadContratista"].setValue(element.usuarioDependencia.dependencia.nombre);
            }
            this.listaUsuarioContratistaAgregados = [...this.listaUsuarioContratistaAgregados, element];
          }
        });
      }
    );
  }
  abrirLibro() {
    let usuarioActual = JSON.parse(localStorage.getItem("user"));
    this.router.navigate([
      "/folio/folio-borrador/",
      this.libro.id,
      usuarioActual.id,
    ]);
  }
  obtenerLibro(idLibro) {
    this.libroService.find(idLibro).subscribe((respuesta) => {
      this.libro = respuesta.body;

      this.obtenerContrato(this.libro.contrato.id);

      this.folio.buscarFolioPorLibro(this.libro.id).subscribe((respuesta) => {
        if (respuesta.body.length <= 0) {
          this.abrirLibroMostrar = true;
        } else {
          this.abrirLibroMostrar = false;
        }
      });
      this.libroInfoGeneralFormGroup.patchValue({
        codigo: respuesta.body.codigo,
        nombre: respuesta.body.nombre,
        descripcion: respuesta.body.descripcion,
        tipoFirma: respuesta.body.tipoFirma.nombre,
        estadoLibro: respuesta.body.estadoLibro.nombre,
        fechaCreacion: this.datepipe.transform(
          respuesta.body.fechaCreacion,
          "dd-MM-yyyy "
        ),
        fechaApertura: this.datepipe.transform(
          respuesta.body.fechaApertura,
          "dd-MM-yyyy"
        ),
        fechaCierre: this.datepipe.transform(
          respuesta.body.fechaCierre,
          "dd-MM-yyyy"
        ),
        tipoLibro: respuesta.body.tipoLibro.descripcion,
      });
      this.permisosFormGroup.controls["aperturaMandante"].setValue(
        respuesta.body.aperturaMandante
      );
      this.permisosFormGroup.controls["aperturaContratista"].setValue(
        respuesta.body.aperturaContratista
      );
      this.permisosFormGroup.controls["escrituraMandante"].setValue(
        respuesta.body.escrituraMandante
      );
      this.permisosFormGroup.controls["escrituraContratista"].setValue(
        respuesta.body.escrituraContratista
      );
      this.permisosFormGroup.controls["cierreMandante"].setValue(
        respuesta.body.cierreMandante
      );
      this.permisosFormGroup.controls["cierreContratista"].setValue(
        respuesta.body.cierreContratista
      );
      this.permisosFormGroup.controls["lecturaMandante"].setValue(
        respuesta.body.lecturaMandante
      );
      this.permisosFormGroup.controls["lecturaContratista"].setValue(
        respuesta.body.lecturaContratista
      );

      console.log(this.libro);
      if(this.libro.estadoLibro.nombre.toLowerCase() === "abierto" || this.libro.estadoLibro.nombre.toLowerCase() === "cerrado"){
        this.permisosFormGroup.controls["aperturaMandante"].disable();
        this.permisosFormGroup.controls["aperturaContratista"].disable();
        this.permisosFormGroup.controls["escrituraMandante"].disable();
        this.permisosFormGroup.controls["escrituraContratista"].disable();
        this.permisosFormGroup.controls["cierreMandante"].disable();
        this.permisosFormGroup.controls["cierreContratista"].disable();
        this.permisosFormGroup.controls["lecturaMandante"].disable();
        this.permisosFormGroup.controls["lecturaContratista"].disable();
      }
    }); 
    
    

  }
  inicializadorForms() {
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
    this.libroInfoGeneralFormGroup.controls["codigo"].disable();
    this.libroInfoGeneralFormGroup.controls["nombre"].disable();
    this.libroInfoGeneralFormGroup.controls["descripcion"].disable();
    this.libroInfoGeneralFormGroup.controls["estadoLibro"].disable();
    this.libroInfoGeneralFormGroup.controls["fechaCreacion"].disable();
    this.libroInfoGeneralFormGroup.controls["fechaApertura"].disable();
    this.libroInfoGeneralFormGroup.controls["fechaCierre"].disable();
    this.libroInfoGeneralFormGroup.controls["rutAdminMandante"].disable();
    this.libroInfoGeneralFormGroup.controls["nombreAdminMandante"].disable();
    this.libroInfoGeneralFormGroup.controls["perfilUsuarioAdminMandante"].disable();
    this.libroInfoGeneralFormGroup.controls["cargoAdminMandante"].disable();
    this.libroInfoGeneralFormGroup.controls["entidadAdminMandante"].disable();
    this.libroInfoGeneralFormGroup.controls["rutEntidadAdminMandante"].disable();
    this.libroInfoGeneralFormGroup.controls["dependenciaEntidadMandante"].disable();
    this.libroInfoGeneralFormGroup.controls["emailAdminMandante"].disable();
    this.libroInfoGeneralFormGroup.controls["fechaAsignacionAdminMandante"].disable();
    this.libroInfoGeneralFormGroup.controls["telefonoAdminMandante"].disable();

    this.libroInfoGeneralFormGroup.controls["rutAdminContratista"].disable();
    this.libroInfoGeneralFormGroup.controls["nombreAdminContratista"].disable();
    this.libroInfoGeneralFormGroup.controls["perfilUsuarioAdminContratista"].disable();
    this.libroInfoGeneralFormGroup.controls["fechaAsignacionAdminContratista"].disable();
    this.libroInfoGeneralFormGroup.controls["cargoAdminContratista"].disable();
    this.libroInfoGeneralFormGroup.controls["telefonoAdminContratista"].disable();
    this.libroInfoGeneralFormGroup.controls["emailAdminContratista"].disable();
    this.libroInfoGeneralFormGroup.controls["entidadAdminContratista"].disable();
    this.libroInfoGeneralFormGroup.controls["rutEntidadAdminContratista"].disable();
    this.libroInfoGeneralFormGroup.controls["dependenciaEntidadContratista"].disable();

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
  }
  obtenerTipoLibro() {
    this.tipoLibroService.query().subscribe((respuesta) => {
      this.tipoLibro = respuesta.body;
    });
  }
  obtenerTipoFirma() {
    this.tipoFirmaService.query().subscribe((respuesta) => {
      this.tipoFirma = respuesta.body;
    });
  }
  guardarCambios(){
    this.libro.aperturaContratista = this.permisosFormGroup.controls['aperturaContratista'].value;
    this.libro.aperturaMandante = this.permisosFormGroup.controls['aperturaMandante'].value;
    this.libro.cierreContratista = this.permisosFormGroup.controls['cierreContratista'].value;
    this.libro.cierreMandante = this.permisosFormGroup.controls['cierreMandante'].value;
    this.libro.escrituraContratista = this.permisosFormGroup.controls['escrituraContratista'].value;
    this.libro.escrituraMandante = this.permisosFormGroup.controls['escrituraMandante'].value;
    this.libro.lecturaContratista = this.permisosFormGroup.controls['lecturaContratista'].value;
    this.libro.lecturaMandante = this.permisosFormGroup.controls['lecturaMandante'].value;
    
    this.libroService.update(this.libro).subscribe();
    this.actualizaUsuariosMandante();
    this.actualizaUsuariosContratista();
    
    this.showNotificationSuccess("top", "right");

    if(this.usuarioEliminadosSersionMandante.length > 0){
      this.usuarioEliminadosSersionMandante.forEach(element=>{
        this.usuarioLibroService.delete(element.id).subscribe();
      })
      this.usuarioEliminadosSersionMandante=[];
    }
    if(this.usuarioEliminadosContratista.length > 0){
      this.usuarioEliminadosContratista.forEach(element=>{
        this.usuarioLibroService.delete(element.id).subscribe();
      })
    }
    this.usuarioEliminadosContratista=[];
  }
  actualizaUsuariosMandante(){
    this.listaUsuarioMandante.forEach(element=>{
      if(element.id !== undefined){
        this.usuarioLibroService.update(element).subscribe(
          usuario=>{
            console.log('Usuario Actualizado')
          }
        );
      }
      else{
        element.libro = this.libro;
        this.usuarioLibroService.create(element).subscribe(
          usuario=>{
            console.log(usuario.body);
          }
        );
      }
    })
  }
  actualizaUsuariosContratista(){
    this.listaUsuarioContratistaAgregados.forEach(element=>{
      if(element.id !== undefined){
        this.usuarioLibroService.update(element).subscribe(
          usuario=>{
            console.log('Usuario Actualizado')
          }
        );
      }else{
        element.libro = this.libro;
        this.usuarioLibroService.create(element).subscribe(
          usuario=>{
            console.log(usuario.body);
          }
        );
      }
    })
  }
  modalCrearUsuario() {
    this.listaUsuarios = this.listaUsuariosOrigen;
    let usuarioEditar;
    let existe = false;
    if(this.listaUsuarioMandante.length > 0){
      this.listaUsuarioMandante.forEach(
        element=>{
          if(element.adminActivo === true){
            existe= true;
            usuarioEditar = element;
          }
        }
      );
    }else{
      existe=false;
    }
    let listaUsuariosFiltrados = this.listaUsuarios.filter((usuarios:any)=>{
    let res = this.listaUsuarioMandante.find((usuarioMandante)=>{
       return usuarioMandante.usuarioDependencia.id == usuarios.id_usuario_dependencia;
       });
      return res == undefined;
    });
    this.editar = false;
    if(this.editar === false){
      usuarioEditar = new UsuarioLibro();
    }
    const dialogRef = this.dialog.open(CrearUsuarioComponent, {
      width: "500px",
      data: {
        usuarioLibroPerfil: this.usuarioLibroPerfil,
        usuariosDependenciaMandante: listaUsuariosFiltrados,
        editar : this.editar,
        usuarioEditar : usuarioEditar,
        existe : existe
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
       console.log(result);
      if (result === undefined || result === false || result === "") {
      } else {
        let existe = false;
        existe = this.listaUsuarioMandante.find(usuario => usuario.usuarioDependencia.id === result.usuarioDependencia?.id);
        if(!existe){
          if(result.adminActivo === true){
              this.libroInfoGeneralFormGroup.controls["nombreAdminMandante"].setValue(result.usuarioDependencia.usuario.firstName + '' + result.usuarioDependencia.usuario.lastName);
              this.libroInfoGeneralFormGroup.controls["perfilUsuarioAdminMandante"].setValue(result.perfilUsuarioLibro.nombre);
              this.libroInfoGeneralFormGroup.controls["cargoAdminMandante"].setValue(result.cargoFuncion);
              this.libroInfoGeneralFormGroup.controls["entidadAdminMandante"].setValue(result.usuarioDependencia.dependencia.entidad.nombre);
              this.libroInfoGeneralFormGroup.controls["rutEntidadAdminMandante"].setValue(result.usuarioDependencia.dependencia.entidad.rut);
              this.libroInfoGeneralFormGroup.controls["dependenciaEntidadMandante"].setValue(result.usuarioDependencia.dependencia.nombre);
              this.libroInfoGeneralFormGroup.controls["emailAdminMandante"].setValue(result.usuarioDependencia.usuario.email);
          }
          this.listaUsuarioMandante = [...this.listaUsuarioMandante, result];
        }
      }
    });
  }
  modalCrearUsuarioContratista() {
    let usuarioEditar;
    let existe = false;
    if(this.listaUsuarioContratistaAgregados.length > 0){
      this.listaUsuarioContratistaAgregados.forEach(
        element=>{
          if(element.adminActivo === true){
            existe= true;
            usuarioEditar = element;
          }
        }
      );
    }else{
      existe=false;
    }
    this.listaUsuariosContratista = this.listaUsuariosContratistaOrigen;
    let listaUsuariosFiltrados = this.listaUsuariosContratista.filter((usuarios:any)=>{
      let res = this.listaUsuarioContratistaAgregados.find((usuarioContratista)=>{
       return usuarioContratista.usuarioDependencia.id == usuarios.id_usuario_dependencia;
       });
      return res == undefined;
    });
    this.editar = false;
    if(this.editar === false){
      usuarioEditar = new UsuarioLibro();
    }
    console.log(usuarioEditar);
    const dialogRef = this.dialog.open(CrearUsuarioComponent, {
      width: "500px",
      data: {
        usuarioLibroPerfil: this.usuarioLibroPerfil,
        usuariosDependenciaMandante: listaUsuariosFiltrados,
        editar : this.editar,
        usuarioEditar : usuarioEditar,
        existe : existe
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === undefined || result === false || result === "") {
      } else {
        let existe = false;
        existe = this.listaUsuarioContratistaAgregados.find(usuario => usuario.usuarioDependencia.id === result.usuarioDependencia?.id);
        if(!existe){
          if(result.adminActivo === true){
            console.log(result);
            this.libroInfoGeneralFormGroup.controls["nombreAdminContratista"].setValue(result.usuarioDependencia.usuario.firstName + '' + result.usuarioDependencia.usuario.lastName);
            this.libroInfoGeneralFormGroup.controls["perfilUsuarioAdminContratista"].setValue(result.perfilUsuarioLibro.nombre);
            this.libroInfoGeneralFormGroup.controls["cargoAdminContratista"].setValue(result.cargoFuncion);
            this.libroInfoGeneralFormGroup.controls["emailAdminContratista"].setValue(result.usuarioDependencia.usuario.email);
            this.libroInfoGeneralFormGroup.controls["entidadAdminContratista"].setValue(result.usuarioDependencia.dependencia.entidad.nombre);
            this.libroInfoGeneralFormGroup.controls["rutEntidadAdminContratista"].setValue(result.usuarioDependencia.dependencia.entidad.rut);
            this.libroInfoGeneralFormGroup.controls["dependenciaEntidadContratista"].setValue(result.usuarioDependencia.dependencia.nombre);
          }
          this.listaUsuarioContratistaAgregados = [...this.listaUsuarioContratistaAgregados, result];
        }
      }
    });
  }
  obtenerContrato(idContrato) {
    this.contratoService.find(idContrato).subscribe((respuesta) => {
      this.contrato = respuesta.body;
      // obtener los usuarios para el mandante y el contratista
      // mandante
      this.dependenciaService
        .buscaUsuariosDependencia(this.contrato.dependenciaMandante.id)
        .subscribe((respuesta) => {
          //console.log(respuesta);
          this.listaUsuarios = respuesta.body;
          this.listaUsuariosOrigen = respuesta.body;
          this.muestraListaUsuarios = true;
        });
      this.dependenciaService
        .buscaUsuariosDependencia(this.contrato.idDependenciaContratista)
        .subscribe((respuesta) => {
          //console.log(respuesta);
          this.listaUsuariosContratista = respuesta.body;
          this.listaUsuariosContratistaOrigen = respuesta.body;
          this.muestraListaUsuarios = true;
        });
    });
  }
  obtenerPerfilUsuariolibro() {
    this.perfilUsuarioLibro.query().subscribe((respuesta) => {
      this.usuarioLibroPerfil = respuesta.body;
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
        message: "Cambios guardados Correctamente ",
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
  eliminarUsuarioRowMandante(row){
    const index = this.listaUsuarioMandante.indexOf(row);
    if(row.adminActivo === true ){
      this.libroInfoGeneralFormGroup.controls["rutAdminMandante"].setValue("");
      this.libroInfoGeneralFormGroup.controls["nombreAdminMandante"].setValue("");
      this.libroInfoGeneralFormGroup.controls["perfilUsuarioAdminMandante"].setValue("");
      this.libroInfoGeneralFormGroup.controls["cargoAdminMandante"].setValue("");
      this.libroInfoGeneralFormGroup.controls["entidadAdminMandante"].setValue("");
      this.libroInfoGeneralFormGroup.controls["rutEntidadAdminMandante"].setValue("");
      this.libroInfoGeneralFormGroup.controls["dependenciaEntidadMandante"].setValue("");
      this.libroInfoGeneralFormGroup.controls["emailAdminMandante"].setValue("");
    }
    this.usuarioEliminadosSersionMandante = [...this.usuarioEliminadosSersionMandante,row];
    this.listaUsuarioMandante.splice(index , 1 );
   
  }
  eliminarUsuarioRowContratista(row){
    const index = this.listaUsuarioContratistaAgregados.indexOf(row);
    this.libroInfoGeneralFormGroup.controls["rutAdminContratista"].setValue("");
    this.libroInfoGeneralFormGroup.controls["nombreAdminContratista"].setValue("");
    this.libroInfoGeneralFormGroup.controls["perfilUsuarioAdminContratista"].setValue("");
    this.libroInfoGeneralFormGroup.controls["fechaAsignacionAdminContratista"].setValue("");
    this.libroInfoGeneralFormGroup.controls["cargoAdminContratista"].setValue("");
    this.libroInfoGeneralFormGroup.controls["telefonoAdminContratista"].setValue("");
    this.libroInfoGeneralFormGroup.controls["emailAdminContratista"].setValue("");
    this.libroInfoGeneralFormGroup.controls["entidadAdminContratista"].setValue("");
    this.libroInfoGeneralFormGroup.controls["rutEntidadAdminContratista"].setValue("");
    this.libroInfoGeneralFormGroup.controls["dependenciaEntidadContratista"].setValue("");
    this.usuarioEliminadosContratista = [...this.usuarioEliminadosContratista,row];
    this.listaUsuarioContratistaAgregados.splice(index , 1 );
  }
  editarUsuario(row){
    let existe = false;
    if(this.listaUsuarioMandante.length > 0){
      this.listaUsuarioMandante.forEach(
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
      if (result === undefined || result === false || result === "") {
      } else {
        //console.log(result);
        let existe = false;
        existe = this.listaUsuarioMandante.find(usuario => usuario.usuarioDependencia.id === result.usuarioDependencia?.id);
        if(!existe){
          if(result.adminActivo === true){
            this.usuarioDependenciaService
                    .find(result.usuarioDependencia.id)
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
          
          this.listaUsuarioMandante = [...this.listaUsuarioMandante, result];
        }else{
          if(result.adminActivo === true){
              this.libroInfoGeneralFormGroup.controls["nombreAdminMandante"].setValue(result.usuarioDependencia.usuario.firstName + '' + result.usuarioDependencia.usuario.lastName);
              this.libroInfoGeneralFormGroup.controls["perfilUsuarioAdminMandante"].setValue(result.perfilUsuarioLibro.nombre);
              this.libroInfoGeneralFormGroup.controls["cargoAdminMandante"].setValue(result.cargoFuncion);
              this.libroInfoGeneralFormGroup.controls["entidadAdminMandante"].setValue(result.usuarioDependencia.dependencia.entidad.nombre);
              this.libroInfoGeneralFormGroup.controls["rutEntidadAdminMandante"].setValue(result.usuarioDependencia.dependencia.entidad.rut);
              this.libroInfoGeneralFormGroup.controls["dependenciaEntidadMandante"].setValue(result.usuarioDependencia.dependencia.nombre);
              this.libroInfoGeneralFormGroup.controls["emailAdminMandante"].setValue(result.usuarioDependencia.usuario.email);
          }
          //console.log(this.listaUsuarioMandante);
        }
      }
    });
  }
  editarUsuarioContratista(row){
    let usuarioEditar;
    let existe = false;
    if(this.listaUsuarioContratistaAgregados.length > 0){
      this.listaUsuarioContratistaAgregados.forEach(
        element=>{
          if(element.adminActivo === true){
            existe= true;
            usuarioEditar = element;
          }
        }
      );
    }else{
      existe=false;
    }
    this.listaUsuariosContratista = this.listaUsuariosContratistaOrigen;
    let listaUsuariosFiltrados = this.listaUsuariosContratista.filter((usuarios:any)=>{
      let res = this.listaUsuarioContratistaAgregados.find((usuarioContratista)=>{
       return usuarioContratista.usuarioDependencia.id == usuarios.id_usuario_dependencia;
       });
      return res == undefined;
    });
    this.editar=true;
    const dialogRef = this.dialog.open(CrearUsuarioComponent, {
      width: "500px",
      data: {
        usuarioLibroPerfil: this.usuarioLibroPerfil,
        usuariosDependenciaMandante: this.listaUsuarios,
        editar : this.editar,
        usuarioEditar : row,
        existe  : existe
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === undefined || result === false || result === "") {
      } else {
        //console.log(result);
        let existe = false;
        existe = this.listaUsuarioContratista.find(usuario => usuario.usuarioDependencia.id === result.usuarioDependencia?.id);
        if(!existe){
          if(result.adminActivo === true){
            this.libroInfoGeneralFormGroup.controls["nombreAdminContratista"].setValue(result.usuarioDependencia.usuario.firstName + '' + result.usuarioDependencia.usuario.lastName);
            this.libroInfoGeneralFormGroup.controls["perfilUsuarioAdminContratista"].setValue(result.perfilUsuarioLibro.nombre);
            this.libroInfoGeneralFormGroup.controls["cargoAdminContratista"].setValue(result.cargoFuncion);
            this.libroInfoGeneralFormGroup.controls["emailAdminContratista"].setValue(result.usuarioDependencia.usuario.email);
            this.libroInfoGeneralFormGroup.controls["entidadAdminContratista"].setValue(result.usuarioDependencia.dependencia.entidad.nombre);
            this.libroInfoGeneralFormGroup.controls["rutEntidadAdminContratista"].setValue(result.usuarioDependencia.dependencia.entidad.rut);
            this.libroInfoGeneralFormGroup.controls["dependenciaEntidadContratista"].setValue(result.usuarioDependencia.dependencia.nombre);
          }
          this.listaUsuarioContratista = [...this.listaUsuarioContratista, result];
        }else{
          if(result.adminActivo === true){
            this.libroInfoGeneralFormGroup.controls["nombreAdminContratista"].setValue(result.usuarioDependencia.usuario.firstName + '' + result.usuarioDependencia.usuario.lastName);
            this.libroInfoGeneralFormGroup.controls["perfilUsuarioAdminContratista"].setValue(result.perfilUsuarioLibro.nombre);
            this.libroInfoGeneralFormGroup.controls["cargoAdminContratista"].setValue(result.cargoFuncion);
            this.libroInfoGeneralFormGroup.controls["emailAdminContratista"].setValue(result.usuarioDependencia.usuario.email);
            this.libroInfoGeneralFormGroup.controls["entidadAdminContratista"].setValue(result.usuarioDependencia.dependencia.entidad.nombre);
            this.libroInfoGeneralFormGroup.controls["rutEntidadAdminContratista"].setValue(result.usuarioDependencia.dependencia.entidad.rut);
            this.libroInfoGeneralFormGroup.controls["dependenciaEntidadContratista"].setValue(result.usuarioDependencia.dependencia.nombre);
          }
          console.log(this.listaUsuarioContratista);
        }
      }
    });
  }
  routeDetalleContrato(){
    this.router.navigate(['/contrato/detalle-contrato', this.libro.contrato.id])
  }
  routeResumenFolio(){
    this.router.navigate(['/folio/folio', this.libro.contrato.id,this.libro.id])
  }
}
