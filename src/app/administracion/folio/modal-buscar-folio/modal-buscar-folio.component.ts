import { Component, OnInit, Inject, AfterViewInit, ViewChild } from '@angular/core';
import { TableData } from 'src/app/md/md-table/md-table.component';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { LibroService } from '../../services/libro.service';
import { Libro } from '../../TO/libro.model';
import { FolioService } from '../../services/folio.service';
import { Folio, IFolio } from '../../TO/folio.model';
import { UsuarioLibroService } from '../../services/usuario-libro.service';
import { VisorPdfComponent } from '../../shared/visor-pdf/visor-pdf/visor-pdf.component';
import { Observable } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import { resolve } from 'path';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-modal-buscar-folio',
  templateUrl: './modal-buscar-folio.component.html',
  styleUrls: ['./modal-buscar-folio.component.css']
})
export class ModalBuscarFolioComponent implements OnInit,AfterViewInit {
  public tableData1: TableData;
  libros : Libro[] = [];
  folios: Folio[] = [];
  folios$: Observable<IFolio[]>;
  libroSeleccionado$: Observable<Libro>;
  foliosRelacionados = [];
  ListaFolios : Folio[] = [];
  buscaFolioForm : FormGroup;

  // implementacion tabla con paginador y filtro
  displayedColumns: string[] = ["numeroFolio", "emisor", "asunto", "fechaCreacion", "acciones"];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    public dialogRef: MatDialogRef<ModalBuscarFolioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private libroService : LibroService,
    private folioService : FolioService,
    private usuarioLibroService : UsuarioLibroService,
    private dialog: MatDialog,
    private fb : FormBuilder) {}
    
  ngOnInit(): void {
    this.folios$ = this.folioService.getListaFoliosRelacionadosAgregadosSubject();
    this.folios$.subscribe(
      folios=>{
        this.folios = folios;
        
        console.log(this.folios);
      }
    );
    this.libroService
        .buscarlibroPorContrato(this.data.idContrato)
        .subscribe((respuesta) => {
          this.libros = respuesta.body;
    });
    this.tableData1 = {
      headerRow: [
        "# Folio",
        "Emisor",
        "Tipo Folio - Asunto",
        "Fecha",
        "Accion"
      ],
      dataRows: [],
    };
    this.buscaFolioForm  = this.fb.group({
      libro : []
    })
  }
  ngAfterViewInit(){
    this.buscaFolioForm.controls['libro'].setValue(this.data.libro.nombre);
    this.buscaFolios(this.data.libro);
  }
  buscaFolios(libro){
    let valor2 = [];
    this.folioService.buscarFolioPorLibro(libro.id).subscribe((respuesta) => {
      let folioRelacionado  = new Folio;
      folioRelacionado = this.data.folioRelacionado;
      if(this.data.folioRelacionado !== undefined){
        valor2 = respuesta.body.filter( folio => folio.idUsuarioFirma !== null && folio.id !== folioRelacionado.id);
      }else{
        valor2 = respuesta.body.filter( folio => folio.idUsuarioFirma !== null);
      }
      if(this.folios.length > 0){
        valor2.forEach(valor2=>{
          valor2.existTableSearchFolio = false;
          this.folios.forEach(folios=>{
            if(valor2.id === folios.id){
              valor2.existTableSearchFolio = true;
            }
          })
        })
      }else{
        valor2.forEach(valor2=>{
          valor2.existTableSearchFolio = false;
        });
      }
      setTimeout(() => {
        this.ListaFolios = valor2;
        console.log(this.ListaFolios);
        this.dataSource = new MatTableDataSource(this.ListaFolios);
        this.dataSource.paginator = this.paginator;
        console.log(this.dataSource.data);
      }, 100);
    }); 

  }
  agregar(){
  }
  visorPdf(row){
    let pdf = row.pdfFirmado;
    let contentType = row.pdfFirmadoContentType;
    let url = "data:"+contentType+";base64,"+pdf;
    let promise = new Promise(function (resolve, reject) {
      fetch(url)
      .then(res => {
        return res.blob();
      })
      .then(blob => {
        resolve(URL.createObjectURL(blob));
      });
    });
    promise.then((resultado) => {
      const dialogRef = this.dialog.open(VisorPdfComponent, {
        width: "100%",
        height: "90%",
        data: {
          pdf: resultado,
          folio: null,
          usuario: null,
          pdfArchivoCompleto: null,
          previsualisar : false,
          lectura : false
        },
      });
    });
  }
  deleteFolioReferencia(row){
    this.folioService.removerListaFoliosAgregados(row);
    let index = this.ListaFolios.indexOf(row);
    this.ListaFolios[index].existTableSearchFolio = false;
  
  }
  agregarFolioReferencia(row){
    let index = this.ListaFolios.indexOf(row);
    this.ListaFolios[index].existTableSearchFolio = true;
    this.folioService.AgregarFolioReferenciaAlista(row);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
function removeItemFromArr ( arr, item ) {
  var i = arr.indexOf( item );
  if ( i !== -1 ) {
      arr.splice( i, 1 );
  }
  return arr;
}
