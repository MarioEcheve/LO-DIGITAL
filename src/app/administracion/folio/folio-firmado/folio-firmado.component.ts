import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FolioService } from "../../services/folio.service";
import { Folio } from "../../TO/folio.model";
import { DependenciaService } from "../../services/dependencia.service";
import { UsuarioLibroService } from "../../services/usuario-libro.service";
declare var $: any;
declare interface TableData {
  headerRow: string[];
  dataRows: string[][];
}
@Component({
  selector: "app-folio-firmado",
  templateUrl: "./folio-firmado.component.html",
  styleUrls: ["./folio-firmado.component.css"],
})
export class FolioFirmadoComponent implements OnInit {
  public tableData1: TableData;
  Folio = new Folio();
  dependenciaMandante;
  emisor;
  cities = [
    { value: "paris-0", viewValue: "Paris" },
    { value: "miami-1", viewValue: "Miami" },
    { value: "bucharest-2", viewValue: "Bucharest" },
    { value: "new-york-3", viewValue: "New York" },
    { value: "london-4", viewValue: "London" },
    { value: "barcelona-5", viewValue: "Barcelona" },
    { value: "moscow-6", viewValue: "Moscow" },
  ];
  constructor(
    private route: ActivatedRoute,
    private folioService: FolioService,
    private dependenciaService: DependenciaService,
    private usuarioLibroService: UsuarioLibroService,
    private router: Router
  ) {}
  ngOnInit() {
    let idFolio = this.route.snapshot.paramMap.get("id");
    this.obtenerFolio(idFolio);
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
  obtenerFolio(idFolio) {
    this.folioService.find(idFolio).subscribe((respuesta) => {
      this.Folio = respuesta.body;
      this.obtenerEmisorFolio(respuesta.body.idUsuarioCreador);

      this.dependenciaService
        .find(respuesta.body.libro.contrato.idDependenciaContratista)
        .subscribe((respuesta) => {
          this.dependenciaMandante = respuesta.body;
        });
    });
  }
  obtenerEmisorFolio(idEmisor) {
    this.usuarioLibroService.find(idEmisor).subscribe((respuesta) => {
      console.log(respuesta.body);
      this.emisor = respuesta.body;
    });
  }
  volverListaFolios() {
    this.router.navigate([
      "/folio/folio/",
      this.Folio.libro.contrato.id,
      this.Folio.libro.id,
    ]);
  }
}
