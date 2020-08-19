import { Component, OnInit, ViewChild, Inject } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { EntidadService } from "../../services/entidad.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-modal-buscar-entidad",
  templateUrl: "./modal-buscar-entidad.component.html",
  styleUrls: ["./modal-buscar-entidad.component.css"],
})
export class ModalBuscarEntidadComponent implements OnInit {
  displayedColumns: string[] = ["RUT", "NOMBRE", "DIRECCION", "ACTIVIDADRUBRO"];
  dataSource: MatTableDataSource<any>;
  entidadSeleccionada = [];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(
    private entidadService: EntidadService,
    public dialogRef: MatDialogRef<ModalBuscarEntidadComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    console.log(this.data);
    if (this.data.entidadPerfil === "1" && this.data.usuario === undefined) {
      this.obtenerEntidadesUsuario();
    }
    if (this.data.entidadPerfil === "1" && this.data.usuario === true) {
      this.obtenerEntidades();
    }
    if (this.data.entidadPerfil === "2" && this.data.usuario === undefined) {
      this.obtenerEntidades();
    }
    if (this.data.entidadPerfil === "2" && this.data.usuario === true) {
      this.obtenerEntidadesUsuario();
    }
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  obtenerEntidades() {
    this.entidadService.query().subscribe((respuesta) => {
      console.log(respuesta.body);
      console.log(this.data.entidadSeleccionada);
      let datos = [];
      datos= respuesta.body.filter(entidad=> entidad.id !== this.data.entidadSeleccionada.entidad.id);
      this.dataSource = new MatTableDataSource(datos);
    });
  }
  obtenerEntidadesUsuario() {
    let usuario = JSON.parse(localStorage.getItem("user"));
    this.entidadService
      .buscarEntidadPorUsuario(usuario.id)
      .subscribe((respuesta) => {
        this.dataSource = new MatTableDataSource(respuesta.body);
        
      });
  }
  columnaSeleccionada(row) {
    this.entidadSeleccionada = [];
    this.entidadSeleccionada.push(row);
  }
  datosEntidad(): void {
    if (this.entidadSeleccionada !== undefined) {
      this.dialogRef.close(this.entidadSeleccionada);
    }
  }
}
