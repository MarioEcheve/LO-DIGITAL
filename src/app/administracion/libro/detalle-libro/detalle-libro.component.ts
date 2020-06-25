import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { LibroService } from "../../services/libro.service";
import { ILibro } from "../../TO/libro.model";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { FolioService } from "../../services/folio.service";

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
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private libroService: LibroService,
    private folio: FolioService,
    private fb: FormBuilder
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
  }
  abrirLibro() {
    this.router.navigate(["/folio/folio-borrador/", this.libro.id]);
  }
  obtenerLibro(idLibro) {
    this.libroService.find(idLibro).subscribe((respuesta) => {
      this.libro = respuesta.body;
      this.libroInfoGeneralFormGroup.controls["codigo"].setValue(
        respuesta.body.codigo
      );
      this.libroInfoGeneralFormGroup.controls["nombre"].setValue(
        respuesta.body.nombre
      );
      this.libroInfoGeneralFormGroup.controls["descripcion"].setValue(
        respuesta.body.descripcion
      );
      this.folio.buscarFolioPorLibro(this.libro.id).subscribe((respuesta) => {
        if (respuesta.body.length <= 0) {
          this.abrirLibroMostrar = true;
        } else {
          this.abrirLibroMostrar = false;
        }
      });
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
  }
}
