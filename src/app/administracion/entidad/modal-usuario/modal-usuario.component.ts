import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { User } from 'src/app/core/user/user.model';
import { PerfilUsuarioDependenciaService } from '../../services/perfil-usuario-dependencia.service';
import { PerfilUsuarioDependencia } from '../../TO/perfil-usuario-dependencia.model';
import { RegisterService } from '../../services/register.service';
import { UsuarioDependenciaService } from '../../services/usuario-dependencia.service';
import { UsuarioDependencia } from '../../TO/usuario-dependencia.model';
import { UserService } from '../../services/User.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from "moment";

@Component({
  selector: 'app-modal-usuario',
  templateUrl: './modal-usuario.component.html',
  styleUrls: ['./modal-usuario.component.css']
})
export class ModalUsuarioComponent implements OnInit {
  formUsuario : FormGroup;
  perfilUsuarioDependencia : PerfilUsuarioDependencia[] = [];
  perfilSeleccionado : PerfilUsuarioDependencia;
  constructor( private fb : FormBuilder ,
               private perfilUsuarioDependenciaService : PerfilUsuarioDependenciaService,
               private registerService : RegisterService,
               private usuarioDependenciaService: UsuarioDependenciaService,
               private usuarioService : UserService,
               public dialogRef: MatDialogRef<PerfilUsuarioDependencia>,
               @Inject(MAT_DIALOG_DATA) public data: any,
               ) { }

  ngOnInit(): void {
    this.inicializarFormUsuario();
    this.getTipoPerfilUsuarioDependencia();
  }
  inicializarFormUsuario(){
    this.formUsuario = this.fb.group({
      rut : [''],
      nombres : [''],
      userName : [''],
      apellidoPaterno : [''],
      apellidoMaterno : [''],
      email : [''],
      clave : [''],
      perfil : ['']
    });
  }
  getTipoPerfilUsuarioDependencia(){
    this.perfilUsuarioDependenciaService.query().subscribe(
      perfilUsuarioDependencia=>{
        this.perfilUsuarioDependencia = perfilUsuarioDependencia.body;
      }
    );
  }
  guardarUsuario(){
    let json = {
      activated: true,
      authorities: ["ROLE_USER"],
      createdBy: "anonymousUser",
      createdDate: "2020-06-18T21:55:56.630474Z",
      email: "fvilchessoleman@gmail.com",
      firstName: null,
      id: 1152,
      imageUrl: null,
      langKey: "en",
      lastModifiedBy: "admin",
      lastModifiedDate: "2020-06-18T21:56:02.369106Z",
      lastName: null,
      login: "fernando",
      password: "",
    };
    // primero vamos a registrar el usuario con su contraseña y su username
    let user = new User();
    user.firstName = this.formUsuario.controls["nombres"].value;
    user.lastName = `${this.formUsuario.controls["apellidoPaterno"].value} ${this.formUsuario.controls["apellidoMaterno"].value}`;
    user.email = this.formUsuario.controls["email"].value;
    (user.authorities = ["ROLE_USER"]), (user.activated = true);
    user.langKey = "en";
    user.password = this.formUsuario.controls["clave"].value;
    user.login = this.formUsuario.controls["userName"].value;
    
    this.registerService.save(user).subscribe(
      (respuesta: any) => {
        this.usuarioService
          .find(user.login.toLowerCase())
          .subscribe((respuesta) => {
            console.log(respuesta);
            respuesta.activated = true;
            this.usuarioService.update(respuesta).subscribe((respuesta) => {
              let usuarioDependencia = new UsuarioDependencia();
              usuarioDependencia.nombre = user.login;
              usuarioDependencia.rut = this.formUsuario.controls["rut"].value;
              usuarioDependencia.fechaCreacion =  moment(Date.now());
              usuarioDependencia.perfilUsuarioDependencia = this.perfilSeleccionado;
              usuarioDependencia.usuario = respuesta;
              usuarioDependencia.estado = true;
              usuarioDependencia.fechaActivacion =  moment(Date.now());
              usuarioDependencia.dependencia = this.data.dependenciaActual;
              this.usuarioDependenciaService
                .create(usuarioDependencia)
                .subscribe((respuesta) => {
                  this.dialogRef.close();
                });
            },error=>{

            }
            );
          });
      },
      (error) => {
        console.log(error);
      }
    ); 
    console.log(user);
  }
  setPerfil(perfil){
    this.perfilSeleccionado = perfil;
  }
}
