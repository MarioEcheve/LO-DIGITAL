import { Component, OnInit } from "@angular/core";
import {
  trigger,
  state,
  transition,
  style,
  animate,
} from "@angular/animations";
import { MatTableDataSource } from "@angular/material/table";

@Component({
  selector: "app-lista-libro",
  templateUrl: "./lista-libro.component.html",
  styleUrls: ["./lista-libro.component.css"],
  animations: [
    trigger("detailExpand", [
      state("collapsed", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      ),
    ]),
  ],
})
export class ListaLibroComponent implements OnInit {
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  columnsToDisplay = ["name", "weight", "symbol", "position", "acciones"];
  constructor() {}

  ngOnInit(): void {}
}
export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
  description: string;
  acciones: any;
}
const ELEMENT_DATA: PeriodicElement[] = [
  {
    position: 1,
    name: "Hydrogen",
    weight: 1.0079,
    symbol: "H",
    description: `Hydrogen is a chemical element with symbol H and atomic number 1. With a standard
        atomic weight of 1.008, hydrogen is the lightest element on the periodic table.`,
    acciones: "",
  },
  {
    position: 2,
    name: "Helium",
    weight: 4.0026,
    symbol: "He",
    description: `Helium is a chemical element with symbol He and atomic number 2. It is a
        colorless, odorless, tasteless, non-toxic, inert, monatomic gas, the first in the noble gas
        group in the periodic table. Its boiling point is the lowest among all the elements.`,
    acciones: "",
  },
];
