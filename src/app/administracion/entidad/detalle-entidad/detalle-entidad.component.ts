import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxPermissionsService } from 'ngx-permissions';
import { TableData } from 'src/app/md/md-table/md-table.component';
import { ContratoService } from '../../services/contrato.service';
import { DependenciaService } from '../../services/dependencia.service';
import { EntidadService } from '../../services/entidad.service';
import { UsuarioDependenciaService } from '../../services/usuario-dependencia.service';
import { Contrato } from '../../TO/contrato.model';
import { Dependencia } from '../../TO/dependencia.model';
import { Entidad } from '../../TO/entidad.model';
import { UsuarioDependencia } from '../../TO/usuario-dependencia.model';
import { ModalUsuarioComponent } from '../modal-usuario/modal-usuario.component';


declare const $: any;

@Component({
  selector: 'app-detalle-entidad',
  templateUrl: './detalle-entidad.component.html',
  styleUrls: ['./detalle-entidad.component.css']
})
export class DetalleEntidadComponent implements OnInit {
  public tableData1: TableData;
  public tableData2: TableData;
  entidad : Entidad;
  formEntidad : FormGroup;
  listaUsuariosDependenciaEntidad : UsuarioDependencia;
  listaContratosEntidad : Contrato[] = [];
  editarDatosEntidad = false;
  dependenciaActual : Dependencia;
  usuarioDependenciaActual : UsuarioDependencia;
  constructor(  private router : Router , private fb : FormBuilder , 
                private entidadService : EntidadService,
                private route: ActivatedRoute,
                private dependenciaService : DependenciaService,
                private usuarioDependenciaService : UsuarioDependenciaService,
                private contratoService : ContratoService,
                private permissionsService: NgxPermissionsService,
                private dialog: MatDialog, ) { }

  ngOnInit(): void {
    this.inicializarFormEntidad();
    this.buscaEntidad(this.route.snapshot.paramMap.get("id")).then((res :any )=>{
      this.entidad = res;
      this.setValueFormEntidad(res);
      this.filtraDependenciaPorEntidad(res);
      this.buscaUsuarioDependenciaPorEntidad(this.entidad.id);
      this.buscaContratosPorEntidad(this.entidad.id);
      this.perfilUsuarioDependencia();
      
    });
    this.perfilUsuarioDependencia();
    this.tableData1 = {
      headerRow: ["RUT", "Nombre", "Perfil", "Activación", "Desactivación", "Estado", "Acción"],
      dataRows: [],
    };
    this.tableData2 = {
      headerRow: ["Código", "Nombre Contrato", "Creación", "Activación", "Desactivación", "Estado", "Acción"],
      dataRows: []
    };
  }
  nuevoContrato(){
    this.router.navigate(['/contrato/contrato']);
  }
  inicializarFormEntidad(){
    this.formEntidad = this.fb.group({
      rut : ['',],
      nombreEmpresa : [''],
      tipoEmpresa : [''], 
      rubroActividad : [''],
      dependenciaNombre : [''],
      descripcionDependencia : [''],
      direccionDependencia : [''],
      regionDependencia : [''],
      comunaDependencia : [''],
      nombreContactoComercial : [''],
      cargoContactoComercial : [''],
      telefonoPrincipalContactoComercial : [''],
      telefonoSecundarioContactoComercial : [''],
      emailContactoComercial : [''],
      nombreContactoTecnico : [''],
      cargoContactoTecnico : [''],
      telefonoPrincipalContactoTecnico : [''],
      telefonoSecundarioContactoTecnico: [''],
      emailContactoTecnico : [''],
    });
    this.formEntidad.controls['rut'].disable();
    this.formEntidad.controls['nombreEmpresa'].disable();
    this.formEntidad.controls['tipoEmpresa'].disable();
    this.formEntidad.controls['rubroActividad'].disable();
    this.formEntidad.controls['dependenciaNombre'].disable();
    this.formEntidad.controls['descripcionDependencia'].disable();
    this.formEntidad.controls['direccionDependencia'].disable();
    this.formEntidad.controls['nombreContactoComercial'].disable();
    this.formEntidad.controls['cargoContactoComercial'].disable();
    this.formEntidad.controls['telefonoPrincipalContactoComercial'].disable();
    this.formEntidad.controls['telefonoSecundarioContactoComercial'].disable();
    this.formEntidad.controls['emailContactoComercial'].disable();
    this.formEntidad.controls['nombreContactoTecnico'].disable();
    this.formEntidad.controls['cargoContactoTecnico'].disable();
    this.formEntidad.controls['telefonoPrincipalContactoTecnico'].disable();
    this.formEntidad.controls['telefonoSecundarioContactoTecnico'].disable();
    this.formEntidad.controls['emailContactoTecnico'].disable();
    this.formEntidad.controls['regionDependencia'].disable();
    this.formEntidad.controls['comunaDependencia'].disable();

  }
  setValueFormEntidad(entidad : Entidad){
    this.formEntidad.patchValue({
      rut : [entidad.rut],
      nombreEmpresa : [entidad.nombre],
      tipoEmpresa : [entidad.tipoEntidad.nombre], 
      rubroActividad : [entidad.actividadRubro.nombre],
    })
  }
  setValueFormDependencia(dependencia : Dependencia){
    this.formEntidad.patchValue({
      dependenciaNombre : dependencia.nombre,
      descripcionDependencia : dependencia.descripcion,
      direccionDependencia : dependencia.direccion,
      regionDependencia :  dependencia.region.nombre,
      comunaDependencia :  dependencia.comuna.nombre


    })
  }
  setValueContactoComercial(dependencia : Dependencia){
    this.formEntidad.patchValue({
      nombreContactoComercial : dependencia.nombreContactoComercial,
      cargoContactoComercial : dependencia.cargoContactoComercial,
      telefonoPrincipalContactoComercial : dependencia.telefonoPrincipalContactoComercial,
      telefonoSecundarioContactoComercial : dependencia.telefonoSecundarioContactoComercial,
      emailContactoComercial : dependencia.emailContactoComercial
    })
  }
  setValueContactoTecnico(dependencia : Dependencia){
    this.formEntidad.patchValue({
      nombreContactoTecnico : dependencia.nombreContactoTecnico,
      cargoContactoTecnico : dependencia.cargoContactoTecnico,
      telefonoPrincipalContactoTecnico : dependencia.telefonoPrincipalContactoTecnico,
      telefonoSecundarioContactoTecnico : dependencia.telefonoSecundarioContactoTecnico,
      emailContactoTecnico : dependencia.emailContactoTecnico,
    })
  }

  async buscaEntidad(idEntidad){
    let data = await new Promise((resolve)=>{
      this.entidadService.find(idEntidad).subscribe(
        entidad=>{
          resolve(entidad.body);
          return entidad.body;
          
        }
      );
    });
    return data;
  }
  async filtraDependenciaPorEntidad(entidad : Entidad ){
     await new Promise((resolve)=>{
        this.dependenciaService.query().subscribe(
          dependencia=>{
            let listaDependencias ;
            listaDependencias = dependencia.body.filter(dependencia => dependencia.entidad.id === entidad.id);
            this.setValueFormDependencia(listaDependencias[0]);
            this.setValueContactoComercial(listaDependencias[0]);
            this.setValueContactoTecnico(listaDependencias[0]);
            this.dependenciaActual = listaDependencias [0];
            resolve(listaDependencias);
          }
        );
     });
  }
  routeMisEntidades(){
    this.router.navigate(['/entidad/entidad']);
  }
  async buscaUsuarioDependenciaPorEntidad(idEntidad : number){
    await new Promise((resolve)=>{
      this.usuarioDependenciaService.query().subscribe(
        usuariosDependencias => {
          let usuarios;
          usuarios = usuariosDependencias.body.filter(usuario => usuario.dependencia.entidad.id === idEntidad);
          resolve(usuarios);
        }
      );
    }).then((usuarios)=>{
      this.listaUsuariosDependenciaEntidad = usuarios;
    });
  }
  async buscaContratosPorEntidad(idEntidad : number ){
    let listaContratos = [];
    await new Promise((resolve)=>{
      this.contratoService.query().subscribe(
        contratos=>{
          listaContratos = contratos.body.filter(contrato => contrato.dependenciaMandante.entidad.id === idEntidad);
          if(listaContratos.length <= 0){
            contratos.body.forEach(element => {
              this.usuarioDependenciaService.findContratosByDependencia(element.idDependenciaContratista).subscribe(
                contratos =>{
                  contratos.body.forEach(( element2 : any  )=>{
                    let contrato = new Contrato();
                    contrato.id = element2.id;
                    contrato.nombre =  element2.nombre;
                    contrato.codigo = element2.codigo;
                    contrato.descripcion = element2.descripcion;
                    contrato.direccion = element2.direccion;
                    contrato.estadoServicio = { id : element2.id_estado_servicio , nombre : element2.estado_servicio };
                    contrato.tipoContrato = {id : element2.id_tipo_contrato, nombre : element2.tipo_contrato}
                    contrato.modalidad = {id : element2.id_modalidad, nombre : element2.modalidad}
                    listaContratos = [...listaContratos, contrato];
                  })
                }
              );
            });
          }
          setTimeout(() => {
            resolve(listaContratos);
          }, 300);
        }
      );
    }).then((listaContratos : [])=>{
      console.log(this.listaContratosEntidad);
      this.listaContratosEntidad = listaContratos;
    })
  }
  editarDatos(){
    this.editarDatosEntidad = true;
    this.setEnabledContactoEntidadFormValues();
  
  }
  guardarDatosEntidad(){
    this.editarDatosEntidad = false;
    this.setDisabledContactoEntidadFormValues();
    this.dependenciaActual.cargoContactoComercial = this.formEntidad.get('nombreContactoComercial').value;
    this.dependenciaActual.emailContactoComercial = this.formEntidad.get('emailContactoComercial').value;
    this.dependenciaActual.nombreContactoComercial = this.formEntidad.get('nombreContactoComercial').value;
    this.dependenciaActual.telefonoPrincipalContactoComercial = this.formEntidad.get('telefonoPrincipalContactoComercial').value;
    this.dependenciaActual.telefonoSecundarioContactoComercial = this.formEntidad.controls['telefonoSecundarioContactoComercial'].value;
    
    this.dependenciaActual.cargoContactoTecnico = this.formEntidad.get('cargoContactoTecnico').value;
    this.dependenciaActual.emailContactoTecnico = this.formEntidad.get('emailContactoTecnico').value;
    this.dependenciaActual.nombreContactoTecnico = this.formEntidad.get('nombreContactoTecnico').value;
    this.dependenciaActual.telefonoPrincipalContactoTecnico = this.formEntidad.get('telefonoPrincipalContactoTecnico').value;
    this.dependenciaActual.telefonoSecundarioContactoTecnico = this.formEntidad.get('telefonoSecundarioContactoTecnico').value;

    this.editarDependencia(this.dependenciaActual);

  }
  cancelarDatos(){
    this.editarDatosEntidad = false;
    this.setDisabledContactoEntidadFormValues();
    this.setValueContactoComercial(this.dependenciaActual);
    this.setValueContactoTecnico(this.dependenciaActual);
  }
  setEnabledContactoEntidadFormValues(){
    this.formEntidad.controls['nombreContactoComercial'].enable();
    this.formEntidad.controls['cargoContactoComercial'].enable();
    this.formEntidad.controls['telefonoPrincipalContactoComercial'].enable();
    this.formEntidad.controls['telefonoSecundarioContactoComercial'].enable();
    this.formEntidad.controls['emailContactoComercial'].enable();
    this.formEntidad.controls['nombreContactoTecnico'].enable();
    this.formEntidad.controls['cargoContactoTecnico'].enable();
    this.formEntidad.controls['telefonoPrincipalContactoTecnico'].enable();
    this.formEntidad.controls['telefonoSecundarioContactoTecnico'].enable();
    this.formEntidad.controls['emailContactoTecnico'].enable();
  }
  setDisabledContactoEntidadFormValues(){
    this.formEntidad.controls['nombreContactoComercial'].disable();
    this.formEntidad.controls['cargoContactoComercial'].disable();
    this.formEntidad.controls['telefonoPrincipalContactoComercial'].disable();
    this.formEntidad.controls['telefonoSecundarioContactoComercial'].disable();
    this.formEntidad.controls['emailContactoComercial'].disable();
    this.formEntidad.controls['nombreContactoTecnico'].disable();
    this.formEntidad.controls['cargoContactoTecnico'].disable();
    this.formEntidad.controls['telefonoPrincipalContactoTecnico'].disable();
    this.formEntidad.controls['telefonoSecundarioContactoTecnico'].disable();
    this.formEntidad.controls['emailContactoTecnico'].disable();
  }
  async editarDependencia(dependencia : Dependencia){
    await new Promise((resolve)=>{
      this.dependenciaService.update(dependencia).subscribe(
        dependencia => {
          this.showNotificationSuccess("top", "right");
        },error=> {
          this.showNotificationDanger("top", "right");
        }
      );
    });
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
        message: "Cambios guardados Correctamente ",
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
  perfilUsuarioDependencia(){
    let usuarioActual = JSON.parse(localStorage.getItem("user"));
    this.usuarioDependenciaService.findUserByUsuarioDependencia(usuarioActual.id).subscribe(
      usuarioDependencia => {
        let permisos = [ usuarioDependencia.body[0].perfilUsuarioDependencia.nombre.toLowerCase() ];
        console.log(permisos);
        this.permissionsService.loadPermissions(permisos);
      }
    );
  }
  modalUsuario(usuarioDependencia? : UsuarioDependencia){
    console.log(usuarioDependencia);
    let editar = false;
    if(usuarioDependencia !== undefined){
      editar = true;
    }
    const dialogRef = this.dialog.open(ModalUsuarioComponent, {
      width: "40%",
      data: { dependenciaActual: this.dependenciaActual , editar : editar , usuarioDependencia : usuarioDependencia},
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.buscaUsuarioDependenciaPorEntidad(this.entidad.id);
    });
  }
  routeDetalleContrato(row){
    this.router.navigate(['/contrato/detalle-contrato', row.id]);
  }
}
