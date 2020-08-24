import { Component, OnInit, Inject, AfterViewInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import {
  IPerfilUsuarioDependencia,
  PerfilUsuarioDependencia,
} from "../../TO/perfil-usuario-dependencia.model";
import { PerfilUsuarioDependenciaService } from "../../services/perfil-usuario-dependencia.service";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { EntidadService } from "../../services/entidad.service";
import { Observable } from "rxjs";
import { startWith, map } from "rxjs/operators";
import { UsuarioLibroPerfilService } from "../../services/usuario-libro-perfil.service";
import {
  UsuarioLibroPerfil,
  IUsuarioLibroPerfil,
} from "../../TO/usuario-libro-perfil.model";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { UsuarioLibro } from "../../TO/usuario-libro.model";
import { UsuarioDependenciaService } from "../../services/usuario-dependencia.service";
import { UsuarioDependencia } from "../../TO/usuario-dependencia.model";

@Component({
  selector: "app-crear-usuario",
  templateUrl: "./crear-usuario.component.html",
  styleUrls: ["./crear-usuario.component.css"],
})
export class CrearUsuarioComponent implements AfterViewInit {
  usuarioFormGroup: FormGroup;
  myControl = new FormControl();
  options: string[] = ["One", "Two", "Three"];
  filteredOptions: Observable<string[]>;
  listaPerfilesLibro: IUsuarioLibroPerfil;
  idUsuarioDependenciaAutoComplete: number;
  perfilUsuario;
  estadosPerfil = [
    {
      id: 1,
      nombre : "Activo"
    },
    {
      id:2,
      nombre : "Inactivo"
    }
  ]
  constructor(
    private perfilUsuarioDependenciaService: PerfilUsuarioDependenciaService,
    public dialogRef: MatDialogRef<CrearUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private entidadService: EntidadService,
    private perfilUsuarioLibro: UsuarioLibroPerfilService,
    private usuarioDependenciaService: UsuarioDependenciaService
  ) {}

  ngOnInit() {
   
    this.data.usuariosDependenciaMandante.forEach(element => {
        element.nombre = element.nombre +' ' + element.apellidos
    });
    this.options = this.data.usuariosDependenciaMandante;
    this.listaPerfilesLibro = this.data.usuarioLibroPerfil;
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(""),
      map((value) => this._filter(value))
    );

    this.usuarioFormGroup = this.fb.group({
      perfil: ["", [Validators.required]],
      cargo: ["", [Validators.required]],
      estado : []
    });
    if(this.data.editar === true){
      console.log(this.data.usuarioEditar);
      this.myControl.setValue(this.data.usuarioEditar.usuarioDependencia.usuario.firstName + ' '+ this.data.usuarioEditar.usuarioDependencia.usuario.lastName);
      this.usuarioFormGroup.controls['cargo'].setValue(this.data.usuarioEditar.cargoFuncion)
      this.usuarioFormGroup.controls['perfil'].setValue(this.data.usuarioEditar.perfilUsuarioLibro.nombre)
      this.perfilUsuario = this.data.usuarioEditar.perfilUsuarioLibro;
      let estado =  this.data.usuarioEditar.estado;
      if(estado){
        this.usuarioFormGroup.controls['estado'].setValue('Activo')
      }else{
        this.usuarioFormGroup.controls['estado'].setValue('Inactivo')
      }
      this.myControl.disable();
      
    }
    //this.obtenerPerfilUsuarioDependencia();
  }
  ngAfterViewInit() {
    /*
    this.perfilUsuarioLibro.query().subscribe((respuesta) => {
      this.perfiles = respuesta.body;
      this.perfilUsuarioDependenciaService.changePerfilUsuarioDependencia(respuesta.body);
    });
    */
  }
  cerrar() {
    this.dialogRef.close(false);
  }
  asignarUsuario() {
    let usuarioLibro = new UsuarioLibro();
    let estadoUsuarioLibro = this.usuarioFormGroup.controls['estado'].value;
    let valorEstado;
    if(estadoUsuarioLibro === "Activo"){
      usuarioLibro.estado = true;
      valorEstado =  usuarioLibro.estado;
      usuarioLibro.nombreEstado = estadoUsuarioLibro;
    }else{
      usuarioLibro.estado = false;
      usuarioLibro.nombreEstado = estadoUsuarioLibro;
      valorEstado =  usuarioLibro.estado;
    }

    if(this.data.editar === true){
      usuarioLibro = this.data.usuarioEditar;
      usuarioLibro.cargoFuncion = this.usuarioFormGroup.controls['cargo'].value;
      usuarioLibro.perfilUsuarioLibro = this.perfilUsuario;
      usuarioLibro.estado = valorEstado;
      usuarioLibro.nombreEstado = estadoUsuarioLibro;
      this.dialogRef.close(usuarioLibro);

    }else{
      usuarioLibro.cargoFuncion = this.usuarioFormGroup.controls["cargo"].value;
      usuarioLibro.nombre = this.myControl.value;
      usuarioLibro.perfilUsuarioLibro = this.perfilUsuario;
      usuarioLibro.usuarioDependencia = null;
      usuarioLibro.fechaCreacion = null;
      usuarioLibro.fechaModificacion = null;
      usuarioLibro.libro = null;
      usuarioLibro.idUsuarioDependencia = this.idUsuarioDependenciaAutoComplete;
  
      let json_usuario_dep = {
        cargoFuncion: this.usuarioFormGroup.controls["cargo"].value,
        estado: valorEstado,
        nombreEstado :estadoUsuarioLibro,
        fechaCreacion: null,
        fechaModificacion: null,
        gesAlertas: undefined,
        gesFavoritos: undefined,
        gesNotas: undefined,
        id: undefined,
        idUsuarioDependencia: this.idUsuarioDependenciaAutoComplete,
        libro: null,
        nombre: this.myControl.value,
        perfilUsuarioLibro: this.perfilUsuario,
        usuarioDependencia: null,
      };
      //console.log(json_usuario_dep);
  
      this.usuarioDependenciaService
        .find(json_usuario_dep.idUsuarioDependencia)
        .subscribe((respuesta) => {
          /*
          respuesta.body.nombreEstado = 'Activo';
          if(respuesta.body.estado === true){
            respuesta.body.nombreEstado = "Activo";
          }else{
            respuesta.body.nombreEstado = "Inactivo";
          }*/
          json_usuario_dep.usuarioDependencia = respuesta.body;
          json_usuario_dep.estado = valorEstado;
          json_usuario_dep.nombreEstado = estadoUsuarioLibro;
        });
  
      //console.log(json_usuario_dep);
     setTimeout(() => {
      console.log(json_usuario_dep);
      this.dialogRef.close(json_usuario_dep);
     },200);
    }
  }

  valorAutoComplete(option) {
    console.log(option);
    this.idUsuarioDependenciaAutoComplete = option.id_usuario_dependencia;
  }
  valorPerfilUsuarioLibro(perfil){
    this.perfilUsuario = perfil;
  }
  /*
  guardarUsuario() {
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
    user.firstName = this.usuarioFormGroup.controls["nombre"].value;
    user.lastName = this.usuarioFormGroup.controls["apellido"].value;
    user.email = this.usuarioFormGroup.controls["email"].value;
    (user.authorities = ["ROLE_USER"]), (user.activated = true);
    user.langKey = "en";
    user.password = this.usuarioFormGroup.controls["password"].value;
    user.login = this.usuarioFormGroup.controls["username"].value;
    this.registerService.save(user).subscribe(
      (respuesta: any) => {
        this.usuarioService
          .find(user.login.toLowerCase())
          .subscribe((respuesta) => {
            console.log(respuesta);
            respuesta.activated = true;
            this.usuarioService.update(respuesta).subscribe((respuesta) => {
              console.log(respuesta);
              let usuarioDependencia = new UsuarioDependencia();
              usuarioDependencia.nombre = user.login;
              usuarioDependencia.perfilUsuarioDependencia = null;
              usuarioDependencia.usuario = respuesta;
              usuarioDependencia.dependencia = null;
              this.usuarioDependencia
                .create(usuarioDependencia)
                .subscribe((respuesta) => {
                  console.log(respuesta);
                });
            });
          });
      },
      (error) => {
        console.log(error);
      }
    );
    // activamos el usuario creado

    console.log(user);
  }
  */
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(
      (option: any) => option.nombre.toLowerCase().indexOf(filterValue) === 0
    );
  }
}
