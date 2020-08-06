import { Component, OnInit } from "@angular/core";
import { ContratoService } from "../../services/contrato.service";
import { IContrato } from "../../TO/contrato.model";
import { Router } from "@angular/router";
import { UsuarioDependenciaService } from "../../services/usuario-dependencia.service";
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
    private usuarioDependenciaService : UsuarioDependenciaService
  ) {}
  ngOnInit() {
    this.tableData1 = {
      headerRow: [
        "Codigo",
        "Nombre Contrato",
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
        if(usuarioDependencia.body[0]?.perfilUsuarioDependencia?.nombre.toLowerCase() === "administrador"){
          administrador = true;
          usuarioDependen = usuarioDependencia.body[0];
        }else{
          administrador = false;
          usuarioDependen = usuarioDependencia.body[0];
        }
      }
    );
    setTimeout(() => {
      if(administrador === true){
        let usuario = JSON.parse(localStorage.getItem("user"));
        console.log(usuarioDependen.dependencia.id);
        this.usuarioDependenciaService.findContratosByDependencia(usuarioDependen.dependencia.id).subscribe(
          usuarioDependencia=>{
            console.log(usuarioDependencia.body);
            this.listaDeContratos = usuarioDependencia.body;
          });
      }else{
        this.usuarioDependenciaService.findUserByUsuarioDependenciaRolUser(usuario.id).subscribe((respuesta) => {
          console.log(respuesta.body);
          
        });
      }
    }, 900);
  }
  editarContrato(idContrato) {
    this.router.navigate(["/contrato/detalle-contrato/", idContrato]);
  }
}
