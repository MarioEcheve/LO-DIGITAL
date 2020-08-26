import {
  Component,
  OnInit,
  SimpleChanges,
  OnChanges,
  AfterViewInit,
} from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { RegionService } from "../../services/region.service";
import { IRegion } from "../../TO/region.model";
import { ModalidadService } from "../../services/modalidad.service";
import { TipoContratoService } from "../../services/tipo-contrato.service";
import { ComunaService } from "../../services/comuna.service";
import { IComuna } from "../../TO/comuna.model";
import { MatDialog } from "@angular/material/dialog";
import { ModalBuscarEntidadComponent } from "../modal-buscar-entidad/modal-buscar-entidad.component";
import { DependenciaService } from "../../services/dependencia.service";
import { ContratoService } from "../../services/contrato.service";
import { Contrato } from "../../TO/contrato.model";
import { ActivatedRoute, Params, Router } from "@angular/router";
declare const require: any;
declare const $: any;

declare interface TableData {
  headerRow: string[];
  dataRows: string[][];
}
declare interface TableWithCheckboxes {
  id?: number;
  ischecked?: boolean;
  product_name: string;
  type: string;
  quantity: number;
  price: any;
  amount: string;
}

@Component({
  selector: "app-contrato",
  templateUrl: "./contrato.component.html",
  styleUrls: ["./contrato.component.css"],
})
export class ContratoComponent implements OnInit {
  simpleSlider = 40;
  doubleSlider = [20, 60];
  touch: boolean;
  selectedValue: string;
  currentCity: string[];
  regiones = [];
  comunas: IComuna;
  modalidades = [];
  tiposDeContratos = [];
  muestraOtroContrato = false;
  muestraOtraModalidad = false;
  dependenciasMandante = [];
  dependenciasContratista = [];
  // DATOS IMPLEMENTACION STEEPPER
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  contratoForm: FormGroup;
  MandanteFormGroup: FormGroup;
  contratistaFormGroup: FormGroup;
  permisosFormGroup: FormGroup;
  contactoFormGroup: FormGroup;
  isEditable = false;

  constructor(
    private formBuilder: FormBuilder,
    private regionService: RegionService,
    private tipoContratoService: TipoContratoService,
    private modalidadService: ModalidadService,
    private comunaService: ComunaService,
    private dialog: MatDialog,
    private dependenciaService: DependenciaService,
    private contratoService: ContratoService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}
  selectTheme = "primary";

  ngOnInit() {
    this.contratoForm = this.formBuilder.group({
      // To add a validator, we must first convert the string value into an array. The first item in the array is the default value if any, then the next item in the array is the validator. Here we are adding a required validator meaning that the firstName attribute must have a value in it.
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
      entidadPerfil: ["", Validators.required],
    });
    this.MandanteFormGroup = this.formBuilder.group({
      rut: ["", Validators.required],
      nombre: ["", Validators.required],
      comuna: [""],
      region: [""],
      dependenciaMandante: ["", Validators.required],
    });
    this.MandanteFormGroup.controls["rut"].disable();
    this.MandanteFormGroup.controls["nombre"].disable();
    this.MandanteFormGroup.controls["comuna"].disable();
    this.MandanteFormGroup.controls["region"].disable();

    this.contratistaFormGroup = this.formBuilder.group({
      rut: ["", Validators.required],
      nombre: ["", Validators.required],
      comuna: [""],
      region: [""],
      dependenciaContratista: ["", Validators.required],
    });
    this.contratistaFormGroup.controls["rut"].disable();
    this.contratistaFormGroup.controls["nombre"].disable();
    this.contratistaFormGroup.controls["comuna"].disable();
    this.contratistaFormGroup.controls["region"].disable();

    this.permisosFormGroup = this.formBuilder.group({
      creaLibroAdminMan: [false],
      creaLibroAdminCon: [false],
      actualizarContratoAdminMan: [false],
      actualizarContratoAdminCon: [false],
    });

    this.contactoFormGroup = this.formBuilder.group({
      nombreContacto: [""],
      telefonoContacto: [""],
      telefonoContactoSecundario: [""],
      emailContacto: [""],
      monto: [""],
    });

    // llamado de metodo para obtener regiones, tipo de contrato, modalidad
    this.obtenerRegiones();
    this.obtenerModalidadContrato();
    this.obtenerTiposDeContrato();
  }

  myFunc(val: any) {
    // code here
  }

  // servicio para obtener las regiones
  obtenerRegiones() {
    this.regionService.query().subscribe((respuesta) => {
      console.log(respuesta.body);
      this.regiones = respuesta.body;
    });
  }
  // servicio para obtener los tipos de contrato
  obtenerTiposDeContrato() {
    this.tipoContratoService.query().subscribe((respuesta) => {
      this.tiposDeContratos = respuesta.body;
    });
  }
  // servicio para obtener las modalidades de contrato
  obtenerModalidadContrato() {
    this.modalidadService.query().subscribe((respuesta) => {
      this.modalidades = respuesta.body;
    });
  }
  muestraOtroTipoContrato(tipo: string) {
    if (tipo.toLowerCase() == "otro") {
      this.muestraOtroContrato = true;
    } else {
      this.muestraOtroContrato = false;
    }
  }
  muestraOtroTipoModalidad(tipo: string) {
    if (tipo.toLowerCase() == "otro") {
      this.muestraOtraModalidad = true;
    } else {
      this.muestraOtraModalidad = false;
    }
  }
  // metodo para buscar las comunas por medio del id region
  buscaComuna(idRegion: number) {
    this.comunaService.buscaComunaPorRegion(idRegion).subscribe((respuesta) => {
      this.comunas = respuesta.body;
      console.log(respuesta.body);
    });
  }
  // datos primer stepper
  datosPrimerStepper() {
    console.log(this.contratoForm.value);
  }
  // metodo para abrir un pop up que permite buscar entidades
  openDialogBuscaEntidad(usuario?: any) {
    const dialogRef = this.dialog.open(ModalBuscarEntidadComponent, {
      width: "80%",
      height: "90%",
      data: {
        entidadPerfil: this.contratoForm.get("entidadPerfil").value,
        usuario: usuario,
        entidadSeleccionada : this.MandanteFormGroup.controls['dependenciaMandante'].value
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(usuario);
      if (result.length <= 0) {
        if (usuario === undefined) {
          this.MandanteFormGroup.controls["rut"].setValue("");
          this.MandanteFormGroup.controls["nombre"].setValue("");
          this.MandanteFormGroup.controls["region"].setValue("");
          this.MandanteFormGroup.controls["comuna"].setValue("");
          this.MandanteFormGroup.controls["dependenciaMandante"].setValue("");
          this.dependenciasMandante = [];
        } else {
          this.contratistaFormGroup.controls["rut"].setValue("");
          this.contratistaFormGroup.controls["nombre"].setValue("");
          this.contratistaFormGroup.controls["region"].setValue("");
          this.contratistaFormGroup.controls["comuna"].setValue("");
          this.contratistaFormGroup.controls["dependenciaContratista"].setValue(
            ""
          );
          this.dependenciasContratista = [];
        }
      } else {
        if (usuario === undefined) {
          this.MandanteFormGroup.controls["rut"].setValue(result[0].rut);
          this.MandanteFormGroup.controls["nombre"].setValue(result[0].nombre);
          this.dependenciaService
            .buscaDependenciaPorEntidad(result[0].id)
            .subscribe((respuesta) => {
              this.dependenciasMandante = respuesta.body;
            });
        } else {
          this.contratistaFormGroup.controls["rut"].setValue(result[0].rut);
          this.contratistaFormGroup.controls["nombre"].setValue(
            result[0].nombre
          );
          this.dependenciaService
            .buscaDependenciaPorEntidad(result[0].id)
            .subscribe((respuesta) => {
              this.dependenciasContratista = respuesta.body;
            });
        }
      }
    });
  }
  mustraRegionComunaDependencia(dependencia: any) {
    this.MandanteFormGroup.controls["comuna"].setValue(
      dependencia.comuna.nombre
    );
    this.MandanteFormGroup.controls["region"].setValue(
      dependencia.region.nombre
    );
  }
  mustraRegionComunaDependenciaContratista(dependencia: any) {
    this.contratistaFormGroup.controls["comuna"].setValue(
      dependencia.comuna.nombre
    );
    this.contratistaFormGroup.controls["region"].setValue(
      dependencia.region.nombre
    );
  }

  // metodo para obtener la data del stepper de permisos
  datosPermisos() {
    console.log(this.permisosFormGroup.value);
  }
  guardaContrato() {
    let contrato = new Contrato();
    contrato.actualizarContratoAdminCon = this.permisosFormGroup.get(
      "actualizarContratoAdminCon"
    ).value;
    contrato.actualizarContratoAdminMan = this.permisosFormGroup.get(
      "actualizarContratoAdminMan"
    ).value;
    (contrato.creaLibroAdminCon = this.permisosFormGroup.get(
      "creaLibroAdminCon"
    ).value),
      (contrato.creaLibroAdminMan = this.permisosFormGroup.get(
        "creaLibroAdminMan"
      ).value),
      (contrato.codigo = this.contratoForm.get("codigo").value),
      (contrato.comuna = this.contratoForm.get("comuna").value),
      (contrato.region = this.contratoForm.get("region").value),
      (contrato.dependenciaMandante = this.MandanteFormGroup.get(
        "dependenciaMandante"
      ).value),
      (contrato.idDependenciaContratista = this.contratistaFormGroup.get(
        "dependenciaContratista"
      ).value),
      (contrato.descripcion = this.contratoForm.get("descripcion").value),
      (contrato.direccion = this.contratoForm.get("direccion").value),
      (contrato.emailContacto = this.contactoFormGroup.get(
        "emailContacto"
      ).value),
      (contrato.estadoServicio = null),
      //contrato.fechaInicio= "2020-06-18T04:00:00.000Z",
      //contrato.fechaInicioServicio =  "2020-06-18T04:00:00.000Z",
      //fechaTermino: "2020-06-18T04:00:00.000Z",
      //fechaTerminoAcceso: "2020-06-18T04:00:00.000Z",
      //fechaTerminoServicio: "2020-06-18T04:00:00.000Z",
      (contrato.modalidad = this.contratoForm.get("modalidad").value),
      (contrato.modalidadOtra = null),
      //(contrato.cargo = this.contactoFormGroup.get("monto").value),
      (contrato.nombre = this.contratoForm.get("nombre").value),
      (contrato.nombreContacto = this.contactoFormGroup.get(
        "nombreContacto"
      ).value),
      (contrato.observaciones = "1"),
      (contrato.observacionesServicio = "prueba"),
      (contrato.telefonoContacto = this.contactoFormGroup.get(
        "telefonoContacto"
      ).value),
      (contrato.tipoContrato = this.contratoForm.get("tipoContrato").value),
      (contrato.tipoMoneda = null),
      (contrato.tipoMonto = null),
      (contrato.tipoOtro = null),
      (contrato.estadoServicio = {id: 2001, nombre: "Pendiente", contratoes: null})
      this.contratoService.create(contrato).subscribe(
        (respuesta) => {
          console.log(respuesta);
          this.showNotificationSuccess("top", "right");
          this.router.navigate([
            "/contrato/detalle-contrato",
            respuesta.body.id,
          ]);
          //this.stepper.reset();
        },
        (error) => {
          this.showNotificationDanger("top", "right");
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
        message: "Contrato Creado Correctamente ",
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
        message: "Error al crear el contrato",
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
