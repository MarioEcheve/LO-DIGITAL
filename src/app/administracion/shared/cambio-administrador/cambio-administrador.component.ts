import { Component, OnInit, Inject } from '@angular/core';
import { UsuarioLibroService } from '../../services/usuario-libro.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Libro } from '../../TO/libro.model';
import { UsuarioLibro } from '../../TO/usuario-libro.model';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-cambio-administrador',
  templateUrl: './cambio-administrador.component.html',
  styleUrls: ['./cambio-administrador.component.css']
})
export class CambioAdministradorComponent implements OnInit {
  libro : Libro;
  adminActivo : UsuarioLibro;
  formCambioAdmin : FormGroup;
  listaAdministradores : UsuarioLibro[] = [];
  constructor(private usuarioLibro : UsuarioLibroService,
              public dialModalRef: MatDialogRef<CambioAdministradorComponent>,
              private usuarioLibroService: UsuarioLibroService,
              private fb : FormBuilder,
              @Inject(MAT_DIALOG_DATA) public data: any,) { }

  ngOnInit(): void {
    this.inicializarFormAdmin();
    this.getAdministradorActual();
    this.getAdministradoresLibro();
  }
  getAdministradorActual(){
    let dependencia;
    this.libro = this.data.libro;
    let usuario = JSON.parse(localStorage.getItem("user"));
    this.usuarioLibroService
    .buscarlibroPorContrato(this.libro.id, usuario.id)
    .subscribe((respuesta) => {
      
      dependencia = respuesta.body[0].usuarioDependencia.dependencia;
    });
   setTimeout(() => {
    this.usuarioLibroService.getAdministradorActual(this.libro.id, dependencia.id).subscribe(
      adminActual=>{
        console.log(adminActual);
        this.adminActivo = adminActual.body;
        let admin = adminActual.body.usuarioDependencia.usuario.firstName +' ' +adminActual.body.usuarioDependencia.usuario.lastName
        this.formCambioAdmin.controls['adminActual'].setValue(admin);
      }
    );
   }, 500);
  }
  inicializarFormAdmin(){
    this.formCambioAdmin = this.fb.group({
      adminActual : [],
      nuevoAdminActual : []
    });
    this.formCambioAdmin.controls['adminActual'].disable();
  }
  getAdministradoresLibro(){
    let dependencia;
    let usuario = JSON.parse(localStorage.getItem("user"));
    this.usuarioLibroService
    .buscarlibroPorContrato(this.libro.id, usuario.id)
    .subscribe((respuesta) => {
      dependencia = respuesta.body[0].usuarioDependencia.dependencia;
    });
    setTimeout(() => {
      this.usuarioLibroService.getAdministradoresLibro(this.libro.id,dependencia.id).subscribe(
        administradores=>{
          this.listaAdministradores = administradores.body;
        }
      );
    }, 500);
  }
  aceptar(){
    let adminActivo = new UsuarioLibro();
    adminActivo = this.adminActivo;
    let nuevoAdmin = new UsuarioLibro();
    nuevoAdmin = this.formCambioAdmin.controls['nuevoAdminActual'].value;
    let usuariosCambioAdmin = [];
    usuariosCambioAdmin = [...usuariosCambioAdmin,adminActivo];
    usuariosCambioAdmin = [...usuariosCambioAdmin,nuevoAdmin];
    this.dialModalRef.close(usuariosCambioAdmin);
  }
}
