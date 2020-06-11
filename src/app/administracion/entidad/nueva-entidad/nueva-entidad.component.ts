import { Component, OnInit } from '@angular/core';
import { TableData } from "src/app/md/md-table/md-table.component";

@Component({
  selector: 'app-nueva-entidad',
  templateUrl: './nueva-entidad.component.html',
  styleUrls: ['./nueva-entidad.component.css']
})
export class NuevaEntidadComponent implements OnInit {
  public tableData1: TableData;
  public tableData2: TableData;

  constructor() { }

  ngOnInit(): void {
    this.tableData1 = {
      headerRow: ["RUT", "Nombre", "Perfil", "Activación", "Desactivación", "Estado", "Acción"],
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


    this.tableData2 = {
      headerRow: ["Código", "Nombre Contrato", "Creación", "Activación", "Desactivación", "Estado", "Acción"],
      dataRows: [
        [
          "C001",
          "Contrato de Obras 1",
          "12/02/2020 14:30",
          "12/02/2020 14:30",
          "",
          "Activo",
          "btn-link",
        ],
        [
          "C002545",
          "Contrato de Obras 2",
          "12/02/2020 14:30",
          "12/02/2020 14:30",
          "",
          "Activo",
          "btn-link",
        ],
        [
          "C004597",
          "Contrato de Obras 3",
          "12/02/2020 14:30",
          "12/02/2020 14:30",
          "",
          "Activo",
          "btn-link",
        ],
        [
          "C45548",
          "Contrato de Obras 4",
          "12/02/2020 14:30",
          "12/02/2020 14:30",
          "",
          "Activo",
          "btn-link",
        ],
        [
          "Ch5552",
          "Contrato de Obras 5",
          "12/02/2020 14:30",
          "12/02/2020 14:30",
          "12/02/2020 22:00",
          "Inactivo",
          "btn-link",
        ],
      ],
    };


  }

}
