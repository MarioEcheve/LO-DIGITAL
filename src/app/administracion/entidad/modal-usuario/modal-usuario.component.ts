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
declare const $: any;
@Component({
  selector: 'app-modal-usuario',
  templateUrl: './modal-usuario.component.html',
  styleUrls: ['./modal-usuario.component.css']
})
export class ModalUsuarioComponent implements OnInit {
  formUsuario : FormGroup;
  perfilUsuarioDependencia : PerfilUsuarioDependencia[] = [];
  perfilSeleccionado : PerfilUsuarioDependencia;
  estadoSeleccionado ;
  estadoUsuarioDependencia = [
    {
      id : "1",
      nombre : 'Activo',
    },
    {
      id : "2",
      nombre : 'Desactivado',
    }
  ]
  constructor( private fb : FormBuilder ,
               private perfilUsuarioDependenciaService : PerfilUsuarioDependenciaService,
               private registerService : RegisterService,
               private usuarioDependenciaService: UsuarioDependenciaService,
               private usuarioService : UserService,
               public dialogRef: MatDialogRef<PerfilUsuarioDependencia>,
               @Inject(MAT_DIALOG_DATA) public data: any,
               ) { }

  ngOnInit(): void {
    if(this.data.editar === true){
      this.inicializarFormUsuario();
      this.getTipoPerfilUsuarioDependencia();
      this.setUsuarioDependenciaForm(this.data.usuarioDependencia);
      this.disabledFormUsuarioValues();
    }else{
      this.inicializarFormUsuario();
      this.getTipoPerfilUsuarioDependencia();
    }
    
  }
  inicializarFormUsuario(){
    this.formUsuario = this.fb.group({
      rut : [''],
      nombres : [''],
      userName : [''],
      apellidos : [''],
      email : [''],
      clave : [''],
      perfil : [''],
      estadoUsuarioDependencia : ['']
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
    user.lastName = `${this.formUsuario.controls["apellidos"].value}`;
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
      }
    ); 
  }
  setPerfil(perfil){
    this.perfilSeleccionado = perfil;
  }
  setUsuarioDependenciaForm(usuarioDependencia : UsuarioDependencia){
    this.formUsuario.controls['rut'].setValue(usuarioDependencia.rut);
    this.formUsuario.controls['nombres'].setValue(usuarioDependencia.usuario.firstName);
    this.formUsuario.controls['apellidos'].setValue(usuarioDependencia.usuario.lastName);
    this.formUsuario.controls['email'].setValue(usuarioDependencia.usuario.email);
    this.formUsuario.controls['perfil'].setValue(usuarioDependencia.perfilUsuarioDependencia.nombre);
    this.formUsuario.controls['userName'].setValue(usuarioDependencia.usuario.login);
    this.perfilSeleccionado = usuarioDependencia.perfilUsuarioDependencia;
    if(usuarioDependencia.estado === true){
      this.formUsuario.controls['estadoUsuarioDependencia'].setValue(this.estadoUsuarioDependencia[0].nombre);
      this.estadoSeleccionado = true;
    }else{
      this.formUsuario.controls['estadoUsuarioDependencia'].setValue(this.estadoUsuarioDependencia[1].nombre);
      this.estadoSeleccionado = false;
    }
  }
  disabledFormUsuarioValues(){
    this.formUsuario.controls['rut'].disable();
    this.formUsuario.controls['nombres'].disable();
    this.formUsuario.controls['apellidos'].disable();
    this.formUsuario.controls['email'].disable();
    this.formUsuario.controls['clave'].disable();
    this.formUsuario.controls['userName'].disable();
  }
  actualizarUsuario(){
    this.data.usuarioDependencia.perfilUsuarioDependencia = this.perfilSeleccionado;
    this.data.usuarioDependencia.estado = this.estadoSeleccionado;
    if( this.estadoSeleccionado === true){
      this.data.usuarioDependencia.fechaActivacion = moment(Date.now());
      this.data.usuarioDependencia.fechaDesactivacion = "";
    }
    if( this.estadoSeleccionado === false ){
        this.data.usuarioDependencia.fechaDesactivacion = moment(Date.now());
    }
    this.usuarioDependenciaService.update(this.data.usuarioDependencia).subscribe(
      usuarioDependencia=>{
        this.dialogRef.close();
        this.showNotificationSuccess("top", "right");
      },error=> {
        this.showNotificationDanger("top", "right");
      }
    );
  }
  setEstadoUsuario(estado){
    console.log(estado);
    if(estado.id === "1"){
      this.estadoSeleccionado = true;
    }
    if(estado.id === "2"){
      this.estadoSeleccionado = false;
    }
  }
  showNotificationSuccess(from: any, align: any) {
    const type = [
      "",
      "info",
      "success",
      "warning",
      "danger",
      "rose",
      "primary",
    ];

    const color = 2;

    $.notify(
      {
        icon: "notifications",
        message: "Usuario creado correctamente ",
      },
      {
        type: type[color],
        timer: 3000,
        placement: {
          from: from,
          align: align,
        },
        template:
          '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0} alert-with-icon" role="alert">' +
          '<button mat-raised-button type="button" aria-hidden="true" class="close" data-notify="dismiss">  <i class="material-icons">close</i></button>' +
          '<i class="material-icons" data-notify="icon">notifications</i> ' +
          '<span data-notify="title">{1}</span> ' +
          '<span data-notify="message">{2}</span>' +
          '<div class="progress" data-notify="progressbar">' +
          '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
          "</div>" +
          '<a href="{3}" target="{4}" data-notify="url"></a>' +
          "</div>",
      }
    );
  }
  showNotificationDanger(from: any, align: any) {
    const type = [
      "",
      "info",
      "success",
      "warning",
      "danger",
      "rose",
      "primary",
    ];

    const color = 4;

    $.notify(
      {
        icon: "notifications",
        message: "Error al Actualizar",
      },
      {
        type: type[color],
        timer: 3000,
        placement: {
          from: from,
          align: align,
        },
        template:
          '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0} alert-with-icon" role="alert">' +
          '<button mat-raised-button type="button" aria-hidden="true" class="close" data-notify="dismiss">  <i class="material-icons">close</i></button>' +
          '<i class="material-icons" data-notify="icon">notifications</i> ' +
          '<span data-notify="title">{1}</span> ' +
          '<span data-notify="message">{2}</span>' +
          '<div class="progress" data-notify="progressbar">' +
          '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
          "</div>" +
          '<a href="{3}" target="{4}" data-notify="url"></a>' +
          "</div>",
      }
    );
  }
}
