import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UsuarioDependenciaService } from '../../services/usuario-dependencia.service';
import { UsuarioDependencia } from '../../TO/usuario-dependencia.model';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {
  usuarioDependenciaActual : UsuarioDependencia;
  formUsuario : FormGroup;
  constructor( private usuarioDependenciaService : UsuarioDependenciaService, private fb : FormBuilder) { }

  ngOnInit(): void {
    this.cargaUsuarioDependenciaActual();
  }
  async cargaUsuarioDependenciaActual(){
    let usuario = JSON.parse(localStorage.getItem("user"));
    await new Promise(()=>{
      this.usuarioDependenciaService.findUserByUsuarioDependencia(usuario.id).subscribe(
        usuarioDependencia=>{
          this.usuarioDependenciaActual = usuarioDependencia.body[0];
          this.inicializarForm(this.usuarioDependenciaActual)
        }
      )
    });
  }
  inicializarForm(usuarioDependencia : UsuarioDependencia){
    this.formUsuario = this.fb.group({
      rut : ['hola'] 
    });
  }
}
