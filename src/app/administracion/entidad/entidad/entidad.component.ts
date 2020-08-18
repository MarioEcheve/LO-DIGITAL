import { Component, OnInit } from '@angular/core';
import { UsuarioDependenciaService } from '../../services/usuario-dependencia.service';
import { Entidad } from '../../TO/entidad.model';

@Component({
  selector: 'app-entidad',
  templateUrl: './entidad.component.html',
  styleUrls: ['./entidad.component.css']
})
export class EntidadComponent implements OnInit {
  listaEntidades : Entidad[] = [];
  constructor( private usuarioDependenciaService : UsuarioDependenciaService) { }

  ngOnInit(): void {
    this.listaEntidadesUsuario();
  }
  listaEntidadesUsuario(){
    let usuario = JSON.parse(localStorage.getItem("user"));
    this.usuarioDependenciaService.findUserByUsuarioDependencia(usuario.id).subscribe(
      usuarioDependencia=>{
        this.listaEntidades = [...this.listaEntidades, usuarioDependencia.body[0]];
        console.log(this.listaEntidades);
      }
    );
  }
}
