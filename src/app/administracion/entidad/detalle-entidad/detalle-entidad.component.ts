import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TableData } from 'src/app/md/md-table/md-table.component';
import { DependenciaService } from '../../services/dependencia.service';
import { EntidadService } from '../../services/entidad.service';
import { Dependencia } from '../../TO/dependencia.model';
import { Entidad } from '../../TO/entidad.model';

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
  constructor(  private router : Router , private fb : FormBuilder , 
                private entidadService : EntidadService,
                private route: ActivatedRoute,
                private dependenciaService : DependenciaService ) { }

  ngOnInit(): void {
    this.inicializarFormEntidad();
    this.buscaEntidad(this.route.snapshot.paramMap.get("id")).then((res :any )=>{
      this.entidad = res;
      this.setValueFormEntidad(res);
      this.filtraDependenciaPorEntidad(res);
    });
    
    this.tableData1 = {
      headerRow: ["RUT", "Nombre", "Perfil", "Activación", "Desactivación", "Estado", "Acción"],
      dataRows: [
        [
          "15.547.454-6",
          "Nombre ApellidoP ApellidoM",
          "Super Usuario",
          "12/02/2020 14:30",
          "",
          "Activo",
          "btn-link",
        ],
        [
          "14.774.524-3",
          "Nombre ApellidoP ApellidoM",
          "Usuario",
          "12/02/2020 14:30",
          "",
          "Activo",
          "btn-link",
        ],
        [
          "12.774.524-3",
          "Nombre ApellidoP ApellidoM",
          "Usuario",
          "12/02/2020 14:30",
          "",
          "Activo",
          "btn-link",
        ],
        [
          "16.774.524-3",
          "Nombre ApellidoP ApellidoM",
          "Usuario",
          "12/02/2020 14:30",
          "",
          "Activo",
          "btn-link",
        ],
        [
          "18.774.524-3",
          "Nombre ApellidoP ApellidoM",
          "Usuario",
          "12/02/2020 14:30",
          "24/06/2020 16:12",
          "Inactivo",
          "btn-link",
        ],
      ],
    };
    this.tableData2 = {
      headerRow: ["Código", "Nombre Contrato", "Creación", "Activación", "Desactivación", "Estado", "Acción"],
      dataRows: [
        [
          "C001",
          "Contrato de Obras 1",
          "12/02/2020 14:30",
          "12/02/2020 14:30",
          "",
          "Activo",
          "btn-link",
        ],
        [
          "C002545",
          "Contrato de Obras 2",
          "12/02/2020 14:30",
          "12/02/2020 14:30",
          "",
          "Activo",
          "btn-link",
        ],
        [
          "C004597",
          "Contrato de Obras 3",
          "12/02/2020 14:30",
          "12/02/2020 14:30",
          "",
          "Activo",
          "btn-link",
        ],
        [
          "C45548",
          "Contrato de Obras 4",
          "12/02/2020 14:30",
          "12/02/2020 14:30",
          "",
          "Activo",
          "btn-link",
        ],
        [
          "Ch5552",
          "Contrato de Obras 5",
          "12/02/2020 14:30",
          "12/02/2020 14:30",
          "12/02/2020 22:00",
          "Inactivo",
          "btn-link",
        ],
      ],
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
}
