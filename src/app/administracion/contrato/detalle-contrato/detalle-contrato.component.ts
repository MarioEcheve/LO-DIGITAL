import {
  Component,
  OnInit,
  OnChanges,
  AfterViewInit,
  SimpleChanges,
} from "@angular/core";
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
  FormGroup,
} from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";
import { FormBuilder } from "@angular/forms";
import { Route } from "@angular/compiler/src/core";
import { Router, ActivatedRoute } from "@angular/router";
import { ContratoService } from "../../services/contrato.service";
import { RegionService } from "../../services/region.service";
import { IRegion } from "../../TO/region.model";
import { ComunaService } from "../../services/comuna.service";
import { IComuna } from "../../TO/comuna.model";
import { DependenciaService } from "../../services/dependencia.service";
import { LibroService } from "../../services/libro.service";
import { ILibro, Libro } from "../../TO/libro.model";
import { IContrato } from "../../TO/contrato.model";
import { TipoContratoService } from "../../services/tipo-contrato.service";
import { ITipoContrato } from "../../TO/tipo-contrato.model";
import { IModalidad } from "../../TO/modalidad.model";
import { ModalidadService } from "../../services/modalidad.service";
import { FolioService } from "../../services/folio.service";
import { element } from "protractor";
import { UsuarioDependenciaService } from "../../services/usuario-dependencia.service";
import { UsuarioDependencia } from "../../TO/usuario-dependencia.model";
import { NgxPermissionsService } from "ngx-permissions";
import { UsuarioLibroService } from "../../services/usuario-libro.service";


declare const $: any;
interface FileReaderEventTarget extends EventTarget {
  result: string;
}

interface FileReaderEvent extends Event {
  target: EventTarget;
  getMessage(): string;
}

declare interface TableData {
  headerRow: string[];
  dataRows: string[][];
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

@Component({
  selector: "app-detalle-contrato",
  templateUrl: "./detalle-contrato.component.html",
  styleUrls: ["./detalle-contrato.component.css"],
})
export class DetalleContratoComponent
  implements OnInit, OnChanges, AfterViewInit {
  public tableData1: TableData;
  codigoContrato;
  nombreContrato;
  listaRegiones: IRegion[];
  listaComunas: IComuna;
  libros = [];
  contrato: IContrato;
  tipoContrato: ITipoContrato[];
  modalidadContrato: IModalidad[];
  librosUsuario = [];
  validaEditarLibro = false;
  muestraOtroTipoContrato=false;
  muestraOtroTipoModalidad=false;
  cities = [
    { value: "paris-0", viewValue: "Paris" },
    { value: "miami-1", viewValue: "Miami" },
    { value: "bucharest-2", viewValue: "Bucharest" },
    { value: "new-york-3", viewValue: "New York" },
    { value: "london-4", viewValue: "London" },
    { value: "barcelona-5", viewValue: "Barcelona" },
    { value: "moscow-6", viewValue: "Moscow" },
  ];
  emailFormControl = new FormControl("", [
    Validators.required,
    Validators.email,
  ]);

  matcher = new MyErrorStateMatcher();

  type: FormGroup;
  infoGeneralForm: FormGroup;
  permisosForm: FormGroup;
  informacionServicioForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private contratoService: ContratoService,
    private regionService: RegionService,
    private comunaService: ComunaService,
    private dependenciaService: DependenciaService,
    private router: Router,
    private libroService: LibroService,
    private tipoContratoService: TipoContratoService,
    private modalidadService: ModalidadService,
    private folioService : FolioService,
    private UsuarioDependenciaService : UsuarioDependenciaService,
    private permissionsService: NgxPermissionsService,
    private usuarioLibroService : UsuarioLibroService
    
  ) {

  }

  isFieldValid(form: FormGroup, field: string) {
    return !form.get(field).valid && form.get(field).touched;
  }

  displayFieldCss(form: FormGroup, field: string) {
    return {
      "has-error": this.isFieldValid(form, field),
      "has-feedback": this.isFieldValid(form, field),
    };
  }
  ngOnInit() {

    this.folioService.navBarChange(2);
    this.type = this.formBuilder.group({
      // To add a validator, we must first convert the string value into an array. The first item in the array is the default value if any, then the next item in the array is the validator. Here we are adding a required validator meaning that the firstName attribute must have a value in it.
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      email: [
        null,
        [
          Validators.required,
          Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$"),
        ],
      ],
    });
    this.tableData1 = {
      headerRow: [
        "Código",
        "Nombre",
        "Tipo Libro",
        "Tipo Firma",
        "Estado",
        "Acción",
      ],
      dataRows: [
        [
          "LM01",
          "Libro Principal",
          "Maestro",
          "Digital Avanzada",
          "En creación",
          "btn-link",
        ],
        [
          "LC01",
          "Libro de Comuniaciones",
          "Auxiliar",
          "Digital Simple",
          "Abierto",
          "btn-link",
        ],
        [
          "LA01",
          "Libro Prevención de Riesgos",
          "Auxiliar",
          "Por Sistema",
          "Abierto",
          "btn-link",
        ],
        ["LA02", "Libro PAC", "Auxiliar", "Por Sistema", "Abierto", "btn-link"],
        [
          "LA03",
          "Libro Administrativo",
          "Auxiliar",
          "Por Sistema",
          "Cerrado",
          "btn-link",
        ],
      ],
    };
    // implementacion propia
    // definicion de formgroups
    this.infoGeneralForm = this.formBuilder.group({
      codigo: ["", Validators.required],
      nombre: ["", Validators.required],
      descripcion: ["", Validators.required],
      direccion: ["", Validators.required],
      region: ["", Validators.required],
      tipoContrato: ["", Validators.required],
      modalidad: ["", Validators.required],
      comuna: ["", Validators.required],
      tipoOtro: [],
      modalidadOtra: [],
      entidadPerfil: [""],
      rutMandante: [],
      razonSocialMandante: [],
      dependenciaMandante: [],
      direccionDependenciaMandante: [],
      comunaMandante: [],
      regionMandante: [],
      rutContratista: [],
      razonSocialContratista: [],
      dependenciaContratista: [],
      direccionDependenciaContratista: [],
      comunaContratista: [],
      regionContratista: [],
    });
    this.infoGeneralForm.controls["codigo"].disable();
    this.infoGeneralForm.controls["nombre"].disable();
    this.infoGeneralForm.controls["descripcion"].disable();
    this.infoGeneralForm.controls["direccion"].disable();
    this.infoGeneralForm.controls["rutMandante"].disable();
    this.infoGeneralForm.controls["razonSocialMandante"].disable();
    this.infoGeneralForm.controls["dependenciaMandante"].disable();
    this.infoGeneralForm.controls["direccionDependenciaMandante"].disable();
    this.infoGeneralForm.controls["comunaMandante"].disable();
    this.infoGeneralForm.controls["regionMandante"].disable();
    this.infoGeneralForm.controls["rutContratista"].disable();
    this.infoGeneralForm.controls["razonSocialContratista"].disable();
    this.infoGeneralForm.controls["dependenciaContratista"].disable();
    this.infoGeneralForm.controls["direccionDependenciaContratista"].disable();
    this.infoGeneralForm.controls["comunaContratista"].disable();
    this.infoGeneralForm.controls["regionContratista"].disable();
    this.infoGeneralForm.controls["region"].disable();
    this.infoGeneralForm.controls["tipoContrato"].disable();
    this.infoGeneralForm.controls["comuna"].disable();
    this.infoGeneralForm.controls["modalidad"].disable();

    this.permisosForm = this.formBuilder.group({
      creaLibroAdminMan: [false],
      creaLibroAdminCon: [false],
      actualizarContratoAdminMan: [false],
      actualizarContratoAdminCon: [false],
    });
    this.permisosForm.controls["creaLibroAdminMan"].disable();
    this.permisosForm.controls["creaLibroAdminCon"].disable();
    this.permisosForm.controls["actualizarContratoAdminMan"].disable();
    this.permisosForm.controls["actualizarContratoAdminCon"].disable();

    this.informacionServicioForm = this.formBuilder.group({
      nombreContacto: [""],
      telefonoContacto: [""],
      telefonoContactoSecundario: [""],
      emailContacto: [""],
      cargo: [""],
    });
    this.informacionServicioForm.controls["nombreContacto"].disable();
    this.informacionServicioForm.controls["telefonoContacto"].disable();
    this.informacionServicioForm.controls[
      "telefonoContactoSecundario"
    ].disable();
    this.informacionServicioForm.controls["emailContacto"].disable();
    this.informacionServicioForm.controls["cargo"].disable();

    let id = this.route.snapshot.paramMap.get("id");
    this.buscaContrato(id);
    this.buscaTipoContrato();
    this.obtenerModalidadContrato();
  }

  ngOnChanges(changes: SimpleChanges) {
    const input = $(this);

    if (input[0].files && input[0].files[0]) {
      const reader: any = new FileReader();

      reader.onload = function (e: any) {
        $("#wizardPicturePreview").attr("src", e.target.result).fadeIn("slow");
      };
      reader.readAsDataURL(input[0].files[0]);
    }
  }
  ngAfterViewInit() {
    $(window).resize(() => {
      $(".card-wizard").each(function () {
        setTimeout(() => {
          const $wizard = $(this);
          const index = $wizard?.bootstrapWizard("currentIndex");
          let $total = $wizard.find(".nav li").length;
          let $li_width = 100 / $total;

          let total_steps = $wizard.find(".nav li").length;
          let move_distance = $wizard.width() / total_steps;
          let index_temp = index;
          let vertical_level = 0;

          let mobile_device = $(document).width() < 600 && $total > 3;
          if (mobile_device) {
            move_distance = $wizard.width() / 2;
            index_temp = index % 2;
            $li_width = 50;
          }

          $wizard.find(".nav li").css("width", $li_width + "%");

          let step_width = move_distance;
          move_distance = move_distance * index_temp;

          let $current = index + 1;

          if ($current == 1 || (mobile_device == true && index % 2 == 0)) {
            move_distance -= 8;
          } else if (
            $current == total_steps ||
            (mobile_device == true && index % 2 == 1)
          ) {
            move_distance += 8;
          }

          if (mobile_device) {
            let x: any = index / 2;
            vertical_level = parseInt(x);
            vertical_level = vertical_level * 38;
          }

          $wizard.find(".moving-tab").css("width", step_width);
          $(".moving-tab").css({
            transform:
              "translate3d(" +
              move_distance +
              "px, " +
              vertical_level +
              "px, 0)",
            transition: "all 0.5s cubic-bezier(0.29, 1.42, 0.79, 1)",
          });

          $(".moving-tab").css({
            transition: "transform 0s",
          });
        }, 500);
      });
    });
  }
  buscaContrato(id) {
    this.contratoService.find(id).subscribe((respuesta) => {
      this.contrato = respuesta.body;      
      this.obtenerRegiones();
      this.codigoContrato=respuesta.body.codigo
      this.nombreContrato=respuesta.body.nombre
      this.infoGeneralForm.controls["codigo"].setValue(respuesta.body.codigo);
      this.infoGeneralForm.controls["nombre"].setValue(respuesta.body.nombre);
      this.infoGeneralForm.controls["direccion"].setValue(
        respuesta.body.direccion
      );
      this.infoGeneralForm.controls["descripcion"].setValue(
        respuesta.body.descripcion
      );
      this.infoGeneralForm.controls["rutMandante"].setValue(
        respuesta.body.dependenciaMandante.entidad.rut
      );
      this.infoGeneralForm.controls["razonSocialMandante"].setValue(
        respuesta.body.dependenciaMandante.entidad.nombre
      );
      this.infoGeneralForm.controls["dependenciaMandante"].setValue(
        respuesta.body.dependenciaMandante.nombre
      );
      this.infoGeneralForm.controls["direccionDependenciaMandante"].setValue(
        respuesta.body.dependenciaMandante.direccion
      );
      this.infoGeneralForm.controls["comunaMandante"].setValue(
        respuesta.body.dependenciaMandante.comuna.nombre
      );
      this.infoGeneralForm.controls["regionMandante"].setValue(
        respuesta.body.dependenciaMandante.region.nombre
      );

      // servicio para buscar una dependencia por id
      this.dependenciaService
        .find(respuesta.body.idDependenciaContratista)
        .subscribe((respuesta) => {
          this.infoGeneralForm.controls["rutContratista"].setValue(
            respuesta.body.entidad.rut
          );
          this.infoGeneralForm.controls["razonSocialContratista"].setValue(
            respuesta.body.entidad.nombre
          );
          this.infoGeneralForm.controls["dependenciaContratista"].setValue(
            respuesta.body.nombre
          );
          this.infoGeneralForm.controls[
            "direccionDependenciaContratista"
          ].setValue(respuesta.body.direccion);
          this.infoGeneralForm.controls["comunaContratista"].setValue(
            respuesta.body.comuna.nombre
          );
          this.infoGeneralForm.controls["regionContratista"].setValue(
            respuesta.body.region.nombre
          );
        });
      this.permisosForm.controls["creaLibroAdminMan"].setValue(
        respuesta.body.creaLibroAdminMan
      );
      this.permisosForm.controls["creaLibroAdminCon"].setValue(
        respuesta.body.creaLibroAdminCon
      );
      this.permisosForm.controls["actualizarContratoAdminMan"].setValue(
        respuesta.body.actualizarContratoAdminMan
      );
      this.permisosForm.controls["actualizarContratoAdminCon"].setValue(
        respuesta.body.actualizarContratoAdminCon
      );
      this.informacionServicioForm.controls["nombreContacto"].setValue(
        respuesta.body.nombreContacto
      );
      this.informacionServicioForm.controls["cargo"].setValue(
        respuesta.body.monto
      );
      this.informacionServicioForm.controls["telefonoContacto"].setValue(
        respuesta.body.telefonoContacto
      );
      this.informacionServicioForm.controls["emailContacto"].setValue(
        respuesta.body.emailContacto
      );
      this.onChangeRegion(respuesta.body.region.id);
      this.infoGeneralForm.patchValue({
        region: respuesta.body.region.nombre,
        comuna: respuesta.body.comuna.nombre,
        tipoContrato: respuesta.body.tipoContrato.nombre,
        modalidad: respuesta.body.modalidad.nombre,
      });
      this.getMisLibros();        
    });
  }
  // metodo para listar regiones
  obtenerRegiones() {
    this.regionService.query().subscribe((respuesta) => {
      this.listaRegiones = respuesta.body;
    });
  }
  buscaComuna(idRegion: number) {
    this.comunaService.buscaComunaPorRegion(idRegion).subscribe((respuesta) => {
      this.listaComunas = respuesta.body;
    });
  }
  nuevoLibro() {
    let id = this.route.snapshot.paramMap.get("id");
    this.router.navigate(["/libro/nuevo-libro/", id]);
  }
  editarLibro(row) {
    this.router.navigate(["/libro/detalle-libro/", row.id]);
  }
  folios(row) {
    this.router.navigate(["/folio/folio", this.contrato.id, row.id]);
  }
  buscaTipoContrato() {
    this.tipoContratoService.query().subscribe((respuesta) => {
      this.tipoContrato = respuesta.body;
    });
  }
  obtenerModalidadContrato() {
    this.modalidadService.query().subscribe((respuesta) => {
      this.modalidadContrato = respuesta.body;
    });
  }
  onChangeRegion(idRegion) {
    this.comunaService.buscaComunaPorRegion(idRegion).subscribe((respuesta) => {
      this.listaComunas = respuesta.body;
    });
  }
  getMisLibros(){
    this.folioService.navBarChange(2);
    let usuario = JSON.parse(localStorage.getItem("user"));
    let perfilUsuario = new UsuarioDependencia();
    this.UsuarioDependenciaService.findUserByUsuarioDependencia(usuario.id).subscribe(
      usuarioDependencia=>{
        perfilUsuario = usuarioDependencia.body[0].perfilUsuarioDependencia;
          let permisos = [perfilUsuario.nombre.toLowerCase()]
          this.permissionsService.loadPermissions(permisos);
          
          if(perfilUsuario.nombre.toLowerCase() === "super usuario"){

            this.libroService.query().subscribe(
              response=>{
                console.log(response);
                let librosFiltradosPorContrato = response.body.filter(libro => libro.contrato.id === this.contrato.id);
                console.log(librosFiltradosPorContrato);
                this.libros = librosFiltradosPorContrato;
                this.libros.forEach(element=>{
                  this.usuarioLibroService
                  .buscarlibroPorContrato(element.id, usuario.id).subscribe(
                    usuarioLibro=>{
                      let usuarioLibroAdminActual = usuarioLibro.body[0];
                      this.usuarioLibroService.query().subscribe(
                        usuariosLibros=>{
                          let valor = usuariosLibros.body.filter(usuarioLibro=> usuarioLibro.libro.id === element.id && usuarioLibro.adminActivo === true);
                          valor.forEach(element2=>{
                            if(element2.id === usuarioLibroAdminActual.id){
                              console.log(element2);
                              if(element2.adminActivo === true){
                                element.adminLibroActivo = true;
                              }else{
                                element.adminLibroActivo = false;
                              }
                            }
                          });
                        }
                      );
                    }
                  );
                });

              }
            );



           /*  this.libroService.getMisLibrosContratoDetalle(usuario.id, this.contrato.id).subscribe(
              libros=>{
                this.libros = libros.body;
                console.log(libros);
                this.libros.forEach(element=>{
                  this.usuarioLibroService
                  .buscarlibroPorContrato(element.id, usuario.id).subscribe(
                    usuarioLibro=>{
                      let usuarioLibroAdminActual = usuarioLibro.body[0];
                      this.usuarioLibroService.query().subscribe(
                        usuariosLibros=>{
                          let valor = usuariosLibros.body.filter(usuarioLibro=> usuarioLibro.libro.id === element.id && usuarioLibro.adminActivo === true);
                          valor.forEach(element2=>{
                            if(element2.id === usuarioLibroAdminActual.id){
                              console.log(element2);
                              if(element2.adminActivo === true){
                                element.adminLibroActivo = true;
                              }else{
                                element.adminLibroActivo = false;
                              }
                            }
                          });
                        }
                      );
                    }
                  );
                });
              }
            ); */
          }else{
            this.libroService.getMisLibrosContratoDetalle(usuario.id, this.contrato.id).subscribe(
              libros=>{
                this.libros = libros.body;
                this.libros.forEach(element=>{
                  this.usuarioLibroService
                  .buscarlibroPorContrato(element.id, usuario.id).subscribe(
                    usuarioLibro=>{
                      let usuarioLibroAdminActual = usuarioLibro.body[0];
                      this.usuarioLibroService.query().subscribe(
                        usuariosLibros=>{
                          let valor = usuariosLibros.body.filter(usuarioLibro=> usuarioLibro.libro.id === element.id && usuarioLibro.adminActivo === true);
                          valor.forEach(element2=>{
                            if(element2.id === usuarioLibroAdminActual.id){
                              console.log(element2);
                              if(element2.adminActivo === true){
                                element.adminLibroActivo = true;
                              }else{
                                element.adminLibroActivo = false;
                              }
                            }
                          });
                        }
                      );
                    }
                  );
                });
              }
            );
          }
      }
    );
    // valido si el usuario logeado es admin o usuario normal

    
    
  }
  
}
