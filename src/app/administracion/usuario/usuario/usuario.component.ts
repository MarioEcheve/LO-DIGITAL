import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PasswordService } from '../../services/password/password.service';
import { UsuarioDependenciaService } from '../../services/usuario-dependencia.service';
import { UsuarioDependencia } from '../../TO/usuario-dependencia.model';
import Swal from "sweetalert2/dist/sweetalert2.js";
import * as moment from 'moment';
import { UserService } from '../../services/user.service';
declare var $: any;
@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {
    usuarioDependenciaActual : UsuarioDependencia;
  formUsuario : FormGroup;
  formCambioClave : FormGroup;
  cambioClaveUsuario = false;
  editarUsuario = false;
  constructor(  private usuarioDependenciaService : UsuarioDependenciaService, 
                private fb : FormBuilder,
                private passwordService: PasswordService,
                private router : Router,
                private userService : UserService) { }

  ngOnInit(): void {
    this.inicializarForm();
    this.inicializarFormCambioClave();
    this.cargaUsuarioDependenciaActual();
    this.disabledFormCambioClave();
    this.disabledFormUsuario();
    
  }
  async cargaUsuarioDependenciaActual(){
    let usuario = JSON.parse(localStorage.getItem("user"));
    await new Promise(()=>{
      this.usuarioDependenciaService.findUserByUsuarioDependencia(usuario.id).subscribe(
        usuarioDependencia=>{
          this.usuarioDependenciaActual = usuarioDependencia.body[0];
          this.setValueFormUsuario(usuarioDependencia.body[0]);
          this.formCambioClave.controls['login'].setValue(this.usuarioDependenciaActual.usuario.login);
          this.formCambioClave.controls['login'].setValue(this.usuarioDependenciaActual.usuario.login);
        }
      )
    });
  }
  inicializarForm(){
    this.formUsuario = this.fb.group({
      rut : [''] ,
      nombres : [''],
      apellidos : [''],
      emailPrincipal : [''],
      emailSecundario : [''],
      telefonoPrincipal : [''],
      telefonoSecundario : [''],
    });
  }
  inicializarFormCambioClave(){
    this.formCambioClave = this.fb.group({
      login : ['',] ,
      claveActual : ['',[Validators.required]] ,
      claveNueva : ['',[Validators.required]] ,
      repitaClavenueva : ['',Validators.required] ,
    });
  }
  disabledFormUsuario(){
    this.formUsuario.controls['rut'].disable();
    this.formUsuario.controls['nombres'].disable();
    this.formUsuario.controls['apellidos'].disable();
    this.formUsuario.controls['emailPrincipal'].disable();
    this.formUsuario.controls['emailSecundario'].disable();
    this.formUsuario.controls['telefonoPrincipal'].disable();
    this.formUsuario.controls['telefonoSecundario'].disable();
  }
  disabledFormCambioClave(){
    this.formCambioClave.controls['login'].disable();
    this.formCambioClave.controls['claveActual'].disable();
    this.formCambioClave.controls['claveNueva'].disable();
    this.formCambioClave.controls['repitaClavenueva'].disable();
  }
  enabledFormCambioClave(){
    this.formCambioClave.controls['claveActual'].enable();
    this.formCambioClave.controls['claveNueva'].enable();
    this.formCambioClave.controls['repitaClavenueva'].enable();
  }
  setValueFormUsuario(usuarioDependencia : UsuarioDependencia){
    this.formUsuario.controls['rut'].setValue(usuarioDependencia.rut);
    this.formUsuario.controls['nombres'].setValue(`${usuarioDependencia.usuario.firstName}`);
    this.formUsuario.controls['apellidos'].setValue(`${usuarioDependencia.usuario.lastName}`);
    this.formUsuario.controls['emailPrincipal'].setValue(usuarioDependencia.usuario.email);
  }
  setValueFormUsuarioEnable(){
    this.formUsuario.controls['emailPrincipal'].enable();
  }
  
  cambioClave(){
    this.cambioClaveUsuario = true;
    console.log(this.usuarioDependenciaActual);
    this.enabledFormCambioClave();
  }
  cancelar(){
    this.cambioClaveUsuario = false;
    this.disabledFormCambioClave();
  }
  editarUsuarioForm(){
    this.editarUsuario = true;
    this.setValueFormUsuarioEnable();
    
  }
  updateUsuario(){
    //asignacion de valores 
    this.updateUsuarioDependencia();
    this.disabledFormUsuario();
  }
  cancelarEditarUsuarioForm(){
    this.editarUsuario = false;
    this.disabledFormUsuario();
    this.setValueFormUsuario(this.usuarioDependenciaActual);

  }
  guardarCambioClave(){
    // primero va la clave nueva, luego la clave actual
    let claveNueva = this.formCambioClave.controls['claveNueva'].value;
    let claveActual = this.formCambioClave.controls['claveActual'].value;
    let repitaClavenueva = this.formCambioClave.controls['repitaClavenueva'].value;
    if(claveNueva === repitaClavenueva){
      console.log(claveActual);
      console.log(claveNueva);
      this.passwordService.save(claveNueva ,claveActual).subscribe(
        response=>{
          console.log(response);
          this.showNotificationSuccess("top", "right");
          this.mostrarAlertaLoaderEditarClave();
          localStorage.setItem("user", "");
          this.cambioClaveUsuario = false;
        },error=>{
          this.showNotificationDanger("top", "right");
        }
      );
    }else{
      Swal.fire("Error!", "Las claves no son iguales.", "warning");
    }
    
  }
  updateUsuarioDependencia(){
    this.usuarioDependenciaActual.usuario.email = this.formUsuario.controls['emailPrincipal'].value;
    //this.usuarioDependenciaActual.fechaCreacion = moment( this.usuarioDependenciaActual.fechaCreacion);
    //this.usuarioDependenciaActual.fechaModificacion = moment( this.usuarioDependenciaActual.fechaModificacion);
    let id = this.usuarioDependenciaActual.usuario.id;
    this.userService.find("4456").subscribe(
      response=>{
        console.log(response);
        this.editarUsuario = false;
      },error=>{
        this.showNotificationDanger("top","right")
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
  mostrarAlertaLoaderEditarClave(){
    let timerInterval
    Swal.fire({
      title: 'Reinicio de sesion',
      html: 'Usted saldra del sistema en unos segundos...',
      timer: 5000,
      timerProgressBar: true,
      onBeforeOpen: () => {
        Swal.showLoading()
        timerInterval = setInterval(() => {
          const content = Swal.getContent()
          if (content) {
            const b = content.querySelector('b')
            if (b) {
              b.textContent = Swal.getTimerLeft()
            }
          }
        }, 100)
      },
      onClose: () => {
        clearInterval(timerInterval);
        this.router.navigate(["/"]);
      }
    }).then((result) => {
      /* Read more about handling dismissals below */
      if (result.dismiss === Swal.DismissReason.timer) {
      }
  })
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
        message: "Contraseña Actualizada ",
      },
      {
        type: type[color],
        timer: 1500,
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
