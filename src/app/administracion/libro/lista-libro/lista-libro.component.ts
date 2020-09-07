import { Component, OnInit } from "@angular/core";
import {
  trigger,
  state,
  transition,
  style,
  animate,
} from "@angular/animations";
import { MatTableDataSource } from "@angular/material/table";
import { FolioService } from "../../services/folio.service";
import { LibroService } from "../../services/libro.service";
import { ILibro, Libro } from "../../TO/libro.model";
import { TableData } from "src/app/md/md-table/md-table.component";
import { Router } from "@angular/router";
import { ContratoService } from "../../services/contrato.service";
import { NgxPermissionsService } from "ngx-permissions";
import { UsuarioLibroService } from "../../services/usuario-libro.service";
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
  public tableData1: TableData;
  libros : ILibro[]  = [];
  mostrar ="";
  permisos=[];
  validaEditarLibro = true;
  constructor(
    private libroService :LibroService,
    private router : Router,
    private contratoService : ContratoService,
    private folioService : FolioService,
    private permissionsService : NgxPermissionsService,
    private usuarioLibroService: UsuarioLibroService,
  ) {}

  ngOnInit(): void {
    this.getMisLibros();
    this.tableData1 = {
      headerRow: [
        "Código",
        "Nombre",
        "Contrato",
        "Tipo Libro",
        "Tipo Firma",
        "Estado",
        "Acción",
      ],
      dataRows: []
    };
  }

   getMisLibros(){
    this.folioService.navBarChange(2);
    let usuario = JSON.parse(localStorage.getItem("user"));
    this.libroService.getMisLibros(usuario.id).subscribe(
      respuesta => {
        respuesta.body.forEach(element => {
           this.obtenerPerfilLibroUsuario(element.id,usuario.id);
        });
          this.libros = respuesta.body;
      }
    );
  }
  editarLibro(row) {
    this.router.navigate(["/libro/detalle-libro/", row.id]);
  }
  folios(row) {
    this.router.navigate(["/folio/folio", row.contrato.id, row.id]);
  }
  applyFilter(event){

  }
  obtenerPerfilLibroUsuario(idLibro, idUsuario) {
    this.usuarioLibroService
      .buscarlibroPorContrato(idLibro, idUsuario)
      .subscribe((respuesta) => {
        this.libros.forEach(element=>{
          let usuarioLibroAdminActual = respuesta.body[0];
          this.usuarioLibroService.query().subscribe(
            usuariosLibros=>{
              let valor = usuariosLibros.body.filter(usuarioLibro=> usuarioLibro.libro.id === element.id && usuarioLibro.adminActivo === true);
              valor.forEach(element2=>{
                if(element2.id === usuarioLibroAdminActual.id){
                  console.log(element2);
                  if(element2.adminActivo === true){
                    element.adminLibroActivo = true;
                  }else{
                    element.adminLibroActivo = false;
                  }
                }
              });
            }
          );
        });
        this.permisos = [...this.permisos,respuesta.body[0].perfilUsuarioLibro.nombre.toLowerCase()];
        this.permissionsService.loadPermissions(this.permisos);
      });
  }
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
