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
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private libroService: LibroService,
    private folio: FolioService,
    private fb: FormBuilder,
    private tipoLibroService: TipoLibroService,
    private tipoFirmaService: TipoFirmaService,
    public datepipe: DatePipe
  ) {}

  ngOnInit(): void {
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
}
