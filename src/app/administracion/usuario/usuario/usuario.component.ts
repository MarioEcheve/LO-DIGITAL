import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PasswordService } from '../../services/password/password.service';
import { UsuarioDependenciaService } from '../../services/usuario-dependencia.service';
import { UsuarioDependencia } from '../../TO/usuario-dependencia.model';
import Swal from "sweetalert2/dist/sweetalert2.js";
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
                private router : Router) { }

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
    this.formCambioClave.controls['login'].enable();
    this.formCambioClave.controls['claveActual'].enable();
    this.formCambioClave.controls['claveNueva'].enable();
    this.formCambioClave.controls['repitaClavenueva'].enable();
  }
  setValueFormUsuario(usuarioDependencia : UsuarioDependencia){
    this.formUsuario.controls['rut'].setValue(usuarioDependencia.rut);
    this.formUsuario.controls['nombres'].setValue(`${usuarioDependencia.usuario.firstName}`);
    this.formUsuario.controls['apellidos'].setValue(`${usuarioDependencia.usuario.lastName}`);
    this.formUsuario.controls['emailPrincipal'].setValue(usuarioDependencia.usuario.email);
    //this.formUsuario.controls['emailSecundario'].setValue(usuarioDependencia.rut);
    //this.formUsuario.controls['telefonoPrincipal'].setValue(usuarioDependencia.rut);
    //this.formUsuario.controls['telefonoSecundario'].setValue(usuarioDependencia.rut);

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
          localStorage.setItem("user", "");
          this.router.navigate(['/']);
          this.cambioClaveUsuario = false;
        },error=>{
          this.showNotificationDanger("top", "right");
        }
      );
    }else{
      Swal.fire("Error!", "Las claves no son iguales.", "warning");
    }
    
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
        message: "Error al Actualizar el Folio",
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
