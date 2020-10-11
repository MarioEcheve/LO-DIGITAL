import { Component, OnInit } from "@angular/core";
import { ContratoService } from "../../services/contrato.service";
import { IContrato } from "../../TO/contrato.model";
import { Router } from "@angular/router";
import { UsuarioDependenciaService } from "../../services/usuario-dependencia.service";
import { NgxPermissionsService } from 'ngx-permissions';
import { UsuarioLibro } from "../../TO/usuario-libro.model";
import { UsuarioLibroService } from "../../services/usuario-libro.service";
import { DependenciaService } from "../../services/dependencia.service";

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
  listaDeContratos = [];
  constructor(
    private contratoService: ContratoService,
    private router: Router,
    private usuarioDependenciaService : UsuarioDependenciaService,
    private permissionsService: NgxPermissionsService,
    private usuarioLibroService : UsuarioLibroService,
    private dependenciaService : DependenciaService
  ) {}
  ngOnInit() {

    let permisos = this.permissionsService.getPermissions();
    console.log(permisos);
    this.tableData1 = {
      headerRow: [
        "Codigo",
        "Contrato",
        "Direccion",
        "Tipo Contrato",
        "Modalidad",
        "Estado Contrato",
        "Estado Servicio",
        "Acciones",
      ],
      dataRows: [],
    };
    this.obtenerListaDeContratos();
    console.log(this.listaDeContratos);
  }
   obtenerListaDeContratos() {
    let usuario = JSON.parse(localStorage.getItem("user"));
    let administrador = false;
    let usuarioDependen;
    this.usuarioDependenciaService.findUserByUsuarioDependencia(usuario.id).subscribe(
      usuarioDependencia=>{
        usuarioDependen = usuarioDependencia.body;
        usuarioDependen.forEach(element => {
          this.contratoService.buscaContratoPorDependencia(element.dependencia.id).subscribe(
            respuesta=>{
              console.log(respuesta.body);
              setTimeout(() => {
               if(respuesta.body.length > 0){
                respuesta.body.forEach(element=>{
                  this.listaDeContratos = [...this.listaDeContratos , element];
                })
               }
              }, 200);
            }
          );
        }); 
      }
    );    
  }
  editarContrato(idContrato) {
    this.router.navigate(["/contrato/detalle-contrato/", idContrato]);
  }
  
}
