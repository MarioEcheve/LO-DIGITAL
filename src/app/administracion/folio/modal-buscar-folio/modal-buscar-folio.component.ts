import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
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
  buscaFolioForm : FormGroup;
  constructor(
    public dialogRef: MatDialogRef<ModalBuscarFolioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private libroService : LibroService,
    private folioService : FolioService,
    private usuarioLibroService : UsuarioLibroService,
    private dialog: MatDialog,
    private fb : FormBuilder) {}
    
  ngOnInit(): void {
    this.folios$ = this.folioService.getFolioRelacionadoSubject();
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
      valor2 = respuesta.body.filter( folio => folio.idUsuarioFirma !== null);
      valor2.forEach(element=>{
        this.usuarioLibroService
        .find(element.idUsuarioFirma)
        .subscribe((respuesta) => {
          element.emisor = respuesta.body.usuarioDependencia.usuario.firstName +
          " " + respuesta.body.usuarioDependencia.usuario.lastName;
        });
      });
      console.log(valor2);
      this.folioService.ListaFoliosDeFolios(valor2);
    }); 

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
  agregarFolioReferencia(row){
    this.folioService.AgregarFolioReferenciaAlista(row);
  }
  agregar(){
  }
}
function removeItemFromArr ( arr, item ) {
  var i = arr.indexOf( item );
  if ( i !== -1 ) {
      arr.splice( i, 1 );
  }
  return arr;
}
