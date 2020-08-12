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
  contrato :  Contrato;
  listaUsuarioContratista = [];
  muestraListaUsuarios = false;
  listaUsuarios : User[] = [];
  listaUsuariosContratista: User[] = [];
  usuarioLibroPerfil: IUsuarioLibro[];
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
    private perfilUsuarioLibro : UsuarioLibroPerfilService
  ) {}

  ngOnInit(): void {
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
            this.listaUsuarioMandante = [...this.listaUsuarioMandante, element];
          }else{
            this.listaUsuarioContratista = [...this.listaUsuarioContratista, element];
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
    });
  }
  inicializadorForms() {
    // form para informacion general
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
    //console.log(this.libroInfoGeneralFormGroup.value);
    //console.log(this.permisosFormGroup.value);
    //console.log(this.listaUsuarioMandante);
    //console.log(this.listaUsuarioContratista);
    this.actualizaUsuariosMandante();
    this.actualizaUsuariosContratista();
  }
  actualizaUsuariosMandante(){
    this.listaUsuarioMandante.forEach(element=>{
      if(element.id !== undefined){
        this.usuarioLibroService.find(element.id).subscribe(
          usuarioBuscado=>{
            let usuarioLibro = new UsuarioLibro();
            usuarioLibro = usuarioBuscado.body;
            console.log(usuarioLibro);
            this.usuarioLibroService.update(usuarioLibro).subscribe(
              usuario=>{
                console.log('Usuario Actualizado')
              }
            );
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
    this.listaUsuarioContratista.forEach(element=>{
      if(element.id !== undefined){
        this.usuarioLibroService.find(element?.id).subscribe(
          usuarioBuscado=>{
            let usuarioLibro = new UsuarioLibro();
            usuarioLibro = usuarioBuscado.body;
            console.log(usuarioLibro);
            this.usuarioLibroService.update(usuarioLibro).subscribe(
              usuario=>{
                console.log('Usuario Actualizado')
              }
            );
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
    const dialogRef = this.dialog.open(CrearUsuarioComponent, {
      width: "500px",
      data: {
        usuarioLibroPerfil: this.usuarioLibroPerfil,
        usuariosDependenciaMandante: this.listaUsuarios
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === undefined || result === false) {
      } else {
        let existe = false;
        existe = this.listaUsuarioMandante.find(usuario => usuario.usuarioDependencia.id === result.usuarioDependencia?.id);
        if(!existe){
          this.listaUsuarioMandante = [...this.listaUsuarioMandante, result];
        } else{

        }
      }
    });
  }
  modalCrearUsuarioContratista() {
    const dialogRef = this.dialog.open(CrearUsuarioComponent, {
      width: "500px",
      data: {
        usuarioLibroPerfil: this.usuarioLibroPerfil,
        usuariosDependenciaMandante: this.listaUsuariosContratista
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === undefined || result === false) {
      } else {
        let existe = false;
        existe = this.listaUsuarioContratista.find(usuario => usuario.usuarioDependencia.id === result.usuarioDependencia?.id);
        if(!existe){
          this.listaUsuarioContratista = [...this.listaUsuarioContratista, result];
        } else{

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
  obtenerPerfilUsuariolibro() {
    this.perfilUsuarioLibro.query().subscribe((respuesta) => {
      this.usuarioLibroPerfil = respuesta.body;
    });
  }
}
