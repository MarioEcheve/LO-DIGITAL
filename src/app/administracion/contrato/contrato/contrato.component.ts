import { Component, OnInit } from "@angular/core";

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
  regularItems = ["Pizza", "Pasta", "Parmesan"];
  touch: boolean;

  selectedValue: string;
  currentCity: string[];

  selectTheme = "primary";
  cities = [
    { value: "paris-0", viewValue: "Paris" },
    { value: "miami-1", viewValue: "Miami" },
    { value: "bucharest-2", viewValue: "Bucharest" },
    { value: "new-york-3", viewValue: "New York" },
    { value: "london-4", viewValue: "London" },
    { value: "barcelona-5", viewValue: "Barcelona" },
    { value: "moscow-6", viewValue: "Moscow" },
  ];

  ngOnInit() {
    this.tableData1 = {
      headerRow: ["Código", "Nombre", "Tipo Libro", "Tipo Firma", "Estado", "Actions"],
      dataRows: [
        ["LM01", "Libro Principal", "Maestro", "Digital Avanzada", "En creación", "btn-link"],
        ["LC01", "Libro de Comuniaciones", "Auxiliar", "Digital Simple", "Abierto", "btn-link"],
        ["LA01", "Libro Prevención de Riesgos", "Auxiliar", "Por Sistema", "Abierto", "btn-link"],
        ["LA02", "Libro PAC", "Auxiliar", "Por Sistema", "Abierto", "btn-link"],
        ["LA03", "Libro Administrativo", "Auxiliar", "Por Sistema", "Cerrado", "btn-link"],
      ],
    };
  }
  myFunc(val: any) {
    // code here
  }
}
