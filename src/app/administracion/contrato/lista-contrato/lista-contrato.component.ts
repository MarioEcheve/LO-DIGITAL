import { Component, OnInit } from "@angular/core";
import { ContratoService } from "../../services/contrato.service";
import { IContrato } from "../../TO/contrato.model";
import { Router } from "@angular/router";
declare var $: any;
declare interface TableData {
  headerRow: string[];
  dataRows: string[][];
}

@Component({
  selector: "app-lista-contrato",
  templateUrl: "./lista-contrato.component.html",
  styleUrls: ["./lista-contrato.component.css"],
})
export class ListaContratoComponent implements OnInit {
  public tableData1: TableData;
  listaDeContratos: IContrato[];
  constructor(
    private contratoService: ContratoService,
    private router: Router
  ) {}
  ngOnInit() {
    this.tableData1 = {
      headerRow: [
        "#",
        "Nombre Contrato",
        "Codigo",
        "Direccion",
        "Tipo Contrato",
        "Acciones",
      ],
      dataRows: [],
    };
    this.obtenerListaDeContratos();
    console.log(this.listaDeContratos);
  }
  obtenerListaDeContratos() {
    this.contratoService.query().subscribe((respuesta) => {
      this.listaDeContratos = respuesta.body;
    });
  }
  editarContrato(idContrato) {
    this.router.navigate(["/contrato/detalle-contrato/", idContrato]);
  }
}
