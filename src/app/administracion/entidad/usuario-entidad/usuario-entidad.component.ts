import { Component, OnInit } from "@angular/core";
import { TableData } from "src/app/md/md-table/md-table.component";

@Component({
  selector: "app-usuario-entidad",
  templateUrl: "./usuario-entidad.component.html",
  styleUrls: ["./usuario-entidad.component.css"],
})
export class UsuarioEntidadComponent implements OnInit {
  public tableData1: TableData;
  constructor() {}

  ngOnInit(): void {
    this.tableData1 = {
      headerRow: ["RUT", "Nombre", "Perfil", "Fecha Activación", "Fecha Desactivación", "Estado", "Acción"],
      dataRows: [
        [
          "15.547.454-6",
          "Nombre ApellidoP ApellidoM",
          "Super Usuario",
          "12/02/2020 14:30",
          "",
          "Activo",
          "btn-link",
        ],
        [
          "14.774.524-3",
          "Nombre ApellidoP ApellidoM",
          "Usuario",
          "12/02/2020 14:30",
          "",
          "Activo",
          "btn-link",
        ],
        [
          "12.774.524-3",
          "Nombre ApellidoP ApellidoM",
          "Usuario",
          "12/02/2020 14:30",
          "",
          "Activo",
          "btn-link",
        ],
        [
          "16.774.524-3",
          "Nombre ApellidoP ApellidoM",
          "Usuario",
          "12/02/2020 14:30",
          "",
          "Activo",
          "btn-link",
        ],
        [
          "18.774.524-3",
          "Nombre ApellidoP ApellidoM",
          "Usuario",
          "12/02/2020 14:30",
          "24/06/2020 16:12",
          "Inactivo",
          "btn-link",
        ],
      ],
    };
  }
}
