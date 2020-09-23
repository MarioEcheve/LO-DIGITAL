import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TableData } from 'src/app/md/md-table/md-table.component';
import { ContratoService } from '../../services/contrato.service';
import { DependenciaService } from '../../services/dependencia.service';
import { EntidadService } from '../../services/entidad.service';
import { UsuarioDependenciaService } from '../../services/usuario-dependencia.service';
import { Contrato } from '../../TO/contrato.model';
import { Dependencia } from '../../TO/dependencia.model';
import { Entidad } from '../../TO/entidad.model';
import { UsuarioDependencia } from '../../TO/usuario-dependencia.model';

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
  constructor(  private router : Router , private fb : FormBuilder , 
                private entidadService : EntidadService,
                private route: ActivatedRoute,
                private dependenciaService : DependenciaService,
                private usuarioDependenciaService : UsuarioDependenciaService,
                private contratoService : ContratoService ) { }

  ngOnInit(): void {
    this.inicializarFormEntidad();
    this.buscaEntidad(this.route.snapshot.paramMap.get("id")).then((res :any )=>{
      this.entidad = res;
      this.setValueFormEntidad(res);
      this.filtraDependenciaPorEntidad(res);
      this.buscaUsuarioDependenciaPorEntidad(this.entidad.id);
      this.buscaContratosPorEntidad(this.entidad.id);
    });
    
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
    });
    this.formEntidad.controls['rut'].disable();
    this.formEntidad.controls['nombreEmpresa'].disable();
    this.formEntidad.controls['tipoEmpresa'].disable();
    this.formEntidad.controls['rubroActividad'].disable();
    this.formEntidad.controls['dependenciaNombre'].disable();
    this.formEntidad.controls['descripcionDependencia'].disable();
    this.formEntidad.controls['direccionDependencia'].disable();
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
      dependenciaNombre : [dependencia.nombre],
      descripcionDependencia : [dependencia.descripcion],
      direccionDependencia : [dependencia.direccion],
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
                    contrato.estadoServicio = { id : element2.id_estado_servicio , nombre : element2.estado_servicio };
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
      console.log(listaContratos);
      this.listaContratosEntidad = listaContratos;
    })
  }
}
