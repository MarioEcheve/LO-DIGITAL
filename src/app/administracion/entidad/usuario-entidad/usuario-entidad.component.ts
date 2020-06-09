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
      headerRow: ["#", "Name", "Job Position", "Since", "Salary", "Actions"],
      dataRows: [
        ["1", "Andrew Mike", "Develop", "2013", "99,225", ""],
        ["2", "John Doe", "Design", "2012", "89,241", "btn-round"],
        ["3", "Alex Mike", "Design", "2010", "92,144", "btn-link"],
        ["4", "Mike Monday", "Marketing", "2013", "49,990", "btn-round"],
        ["5", "Paul Dickens", "Communication", "2015", "69,201", ""],
      ],
    };
  }
}
