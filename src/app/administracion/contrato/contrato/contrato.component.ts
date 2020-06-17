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

export interface TableData2 {
  headerRow: string[];
  dataRows: TableWithCheckboxes[];
}
@Component({
  selector: "app-contrato",
  templateUrl: "./contrato.component.html",
  styleUrls: ["./contrato.component.css"],
})
export class ContratoComponent implements OnInit {
  simpleSlider = 40;
  doubleSlider = [20, 60];
  public tableData1: TableData;
  public tableData2: TableData;
  regularItems = ["Pizza", "Pasta", "Parmesan"];
  touch: boolean;
  contratoForm: FormGroup;
  selectedValue: string;
  currentCity: string[];
  regiones = [];
  comunas: IComuna;
  modalidades = [];
  tiposDeContratos = [];
  muestraOtroContrato = false;
  muestraOtraModalidad = false;

  // DATOS IMPLEMENTACION STEEPPER
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  isEditable = false;

  constructor(
    private formBuilder: FormBuilder,
    private regionService: RegionService,
    private tipoContratoService: TipoContratoService,
    private modalidadService: ModalidadService,
    private comunaService: ComunaService,
    private dialog: MatDialog
  ) {}
  selectTheme = "primary";

  ngOnInit() {
    this.firstFormGroup = this.formBuilder.group({
      firstCtrl: ["", Validators.required],
    });
    this.secondFormGroup = this.formBuilder.group({
      secondCtrl: ["", Validators.required],
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
  openDialogBuscaEntidad() {
    this.dialog.open(ModalBuscarEntidadComponent, {
      width: "50%",
      height: "30%",
    });
  }
}
